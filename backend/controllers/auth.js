require("dotenv").config()
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const User = require("../models/User");

function hashPassword(plaintextPassword) {
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
        bcrypt.hash(plaintextPassword, saltRounds, (err, hashedPassword) => {
            if (err) {
                reject(err);
            } else {
                resolve(hashedPassword);
            }
        });
    });
}

function comparePasswords(hashedPassword, plaintextPassword){
    return new Promise((resolve, reject) => {
        bcrypt.compare(plaintextPassword, hashedPassword, (err, result) => {
            if (err) {
                reject(err);
            } else if (result) {
                resolve(result);
            } else {
                reject('Password is invalid');
            }
        });
    })
}

const register = async(req, res) => {
	let {first_name, last_name, user_name, email, password, password2} = req.body;
	if(!first_name){
        return res.status(400).json({msg: "First name cannot be null"});
    }
    if(!email){
        return res.status(400).json({msg: "Email cannot be null"});
    }
    if(!password){
        res.status(400).json({msg: "Password cannot be null"});
    }
    if(password !== password2){
        return res.status(400).json({msg: "Passwords do not match"});
    }

	if(!user_name && last_name){ // use first_name and last_name to make user_name
        // split where blank space appears(returns an array) and join with empty string
        user_name = first_name.split(' ').join('') + last_name.split(' ').join('');
    }else if(!user_name){   // use first_name to make user_name
        user_name = first_name.split(' ').join('');
    }
    if(!last_name){
        last_name = null;
    }

	const db_user = await User.findOne({email: email});
    if(db_user){
        return res.status(400).json({msg: "User with that email already exists"});
    }

	const hashedPassword = await hashPassword(password)
        .then(hashedPassword => {
            return hashedPassword;
        })
        .catch(error => {
            console.error(error);
        });
	
	const user = await User.create({ first_name, last_name, user_name, email, password: hashedPassword });
	let { _id, user_name: db_user_name } = user;
	const token = jwt.sign({user_id: _id, db_user_name}, process.env.JWT_PRIVATE_KEY, {expiresIn:"7d"});

	return res.status(200).json({msg: "Success", token});
}

const login = async (req, res) => {
	const {user_name, email, password} = req.body;
	if(!email && !user_name){
        return res.status(400).json({msg: "Email or username should be filled"});
    }
    if(!password){
        return res.status(400).json({msg: "Password cannot be null"});
    }

	// get user info according to user_name or email
	let user;
	if(email){
		user = await User.findOne({email: email}, "-created_at -updated_at -__v");
	}else if(user_name){
		user = await User.findOne({user_name: user_name}, "-created_at -updated_at -__v");
	}
    
    // check if the user is null
    if(!user){
        return res.status(400).json({status: "Bad Request", msg: "Credentials incorrect"});
    }

    let { _id, user_name: db_user_name, password: db_password } = user;
	// Compare db_password with requested_password
    let passwordState = await comparePasswords(db_password, password)
        .then(response => response)
        .catch(error => console.log(error))

	// Check if password is correct
    if(!passwordState){
        return res.status(400).json({ status: "Bad Request", msg: "Credentials incorrect" });
    }

    const token = jwt.sign({user_id: _id, db_user_name}, process.env.JWT_PRIVATE_KEY, {expiresIn:"7d"});
    return res.status(200).json({ status: "Success", token: token });
}

const validateToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    if(token){
        /* const options = { algorithms: ['HS384'] };
        const decodedToken = jwt.verify(token, options, process.env.JWT_PRIVATE_KEY); */
        try{
            const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            const { user_id } = decodedToken;
            let user = await User.findById(user_id, "-__v -password -updated_at -created_at")
                .then(user => user)
                .catch(error => console.log(error))
            
            return res.json({msg: "success", decodedToken, user});
        }catch(error){
            return res.status(400).json({status: "Bad Request", msg: "Invalid Token"});
        }

    }
    return res.json({msg: "success"});
}

module.exports = { register, login, validateToken, comparePasswords, hashPassword };
