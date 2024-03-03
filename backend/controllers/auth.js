require("dotenv").config()
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");

// Function to generate a 6-digit verification code
const generateVerificationCode = () => {
  const code = crypto.randomBytes(3).readUIntLE(0, 3) % 1000000; // 3 bytes = 24 bits
  return code.toString().padStart(6, '0'); // Ensure it is a 6-digit code
};

const getMinutesDifference = (date1, date2) => {
  const timestamp1 = date1.getTime();
  const timestamp2 = date2.getTime();
  
  // Calculate the difference in milliseconds
  const differenceInMilliseconds = Math.abs(timestamp2 - timestamp1);
  
  // Convert the difference to minutes
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

  return differenceInMinutes;
};

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

const validateEmailVerificationCodeLocal = async (param) => {
	const { email, confirmationCode } = param;
	if(!email){
		throw new Error("Email not provided");
	}

	let verificationCodeObj;
	try{
		verificationCodeObj = await VerificationCode.findOne({ email: email });
	}catch(error){
		throw new Error("Verification code not found");
	}

	if(verificationCodeObj){
		const { updated_at } = verificationCodeObj;
		const ageOfVerificationCode = getMinutesDifference(updated_at, new Date());

		// if the age of verification code greater than 5 mins
		if(ageOfVerificationCode > 5){
			throw new Error("Outdated verification code");
		}

		if(!confirmationCode){
			throw new Error("Invalid verification code");
		}

		if(confirmationCode !== verificationCodeObj.code){
			throw new Error("Wrong verification code");
		}
	}

	return true;
}

const validateEmailVerificationCode = async (req, res) => {
	const { email } = req.body;

	if(!email){
		return res.status(400).json({ msg: "Email not provided" });
	}

	let verificationCodeObj;
	try{
		verificationCodeObj = await VerificationCode.findOne({ email: email });
	}catch(error){
		return res.status(404).json({ msg: "Verification code not found" });
	}

	if(verificationCodeObj){
		const { updated_at } = verificationCodeObj;
		const ageOfVerificationCode = getMinutesDifference(updated_at, new Date());

		// if the age of verification code greater than 5 mins
		if(ageOfVerificationCode > 5){
			return res.status(400).json({ msg: "Outdated verification code" });
		}

		const { confirmationCode } = req.body;
		if(!confirmationCode){
			return res.status(400).json({ msg: "Invalid verification code" });
		}

		if(confirmationCode !== verificationCodeObj.code){
			return res.status(400).json({ msg: "Wrong verification code" });
		}
	}

	return res.status(200).send({status: true, msg: 'Validated verification code'});
}

const register = async(req, res) => {
	let { first_name, last_name, user_name, email, password, password2, placeOfBirth, currentLocation,
		dateOfBirth, confirmationCode } = req.body;

	if(!confirmationCode){
		return res.status(400).json({msg: "Invalid confirmation code"});
	}else{
		try{
			await validateEmailVerificationCodeLocal({ email, confirmationCode });
		}catch(error){
			return res.status(400).json({msg: "Invalid confirmation code"});
		}
	}

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

	let trimedPlaceOfBirth = [];
	if(placeOfBirth){
		let placeOfBirthInArray = placeOfBirth.split(",");
		if(placeOfBirthInArray.length !== 3){
			return res.status(400).json({msg: "Invalid address format"});
		}

		placeOfBirthInArray.forEach(item => {
			trimedPlaceOfBirth.push(item.trim());
		});
	}
	// console.log(trimedPlaceOfBirth);

	let trimedCurrentLocation = [];
	if(currentLocation){
		let currentLocationInArray = currentLocation.split(",");
		if(currentLocationInArray.length !== 3){
			return res.status(400).json({msg: "Invalid address format"});
		}

		currentLocationInArray.forEach(item => {
			trimedCurrentLocation.push(item.trim());
		});
	}
	// console.log(trimedCurrentLocation);

	// check if the date is in [yyyy-mm-dd] format
	if(dateOfBirth){
		if(!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.exec(dateOfBirth)){
			// console.log("Invalid date");
			return res.status(400).json({msg: "Invalid date format"});
		}
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
	
	const user = await User.create({ first_name, last_name, user_name, email,
			password: hashedPassword, dateOfBirth, placeOfBirth: trimedPlaceOfBirth.toString(),
			currentLocation: trimedCurrentLocation.toString()
	});

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

const checkRegistrationFormOne = async (req, res) => {
	let { first_name, last_name, user_name, email, password, password2 } = req.body;

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

	const sameEmail = await User.findOne({ email: email });
	if(sameEmail !== null && sameEmail !== undefined){
		return res.status(400).json({ msg: "User with that email already exist" });
	}

	return res.status(200).json({ msg: "Success" });
}

const checkRegistrationFormTwo = async (req, res) => {
	let { dateOfBirth, placeOfBirth, currentLocation } = req.body;

	// if dateOfBirth is empty
	if(!dateOfBirth){
		return res.status(400).json({msg: "Date of birth cannot be null"});
	}

	if(!currentLocation){
			return res.status(400).json({msg: "Current location cannot be null"});
	}else{
		let currentLocationInArray = currentLocation.split(",");
		if(currentLocationInArray && currentLocationInArray.length !== 3){
			return res.status(400).json({msg: "Invalid location format"});
		}
	}

	if(!dateOfBirth){
			return res.status(400).json({msg: "CurrentLocation cannot be null"});
	}

	return res.status(200).json({ msg: "Success" });
}


const transporter = nodemailer.createTransport({
		service: 'gmail',
	  host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
				user: process.env.GMAIL_USERNAME,
				pass: process.env.GMAIL_PASSWORD
		},
});

const sendVerificationEmail = async (req, res) => {
	const { email } = req.body;

	const verificationCode = generateVerificationCode();

	// const user = await User.findOne({ email: email }, "_id");
	// if(!user){
	// 	return res.status(404).json({ msg: "User not found" });
	// }

	let verificationCodeObj;
	try{
		verificationCodeObj = await VerificationCode.findOne({ email: email });
	}catch(error){
		console.log(error);
	}
	if(!verificationCodeObj){
		verificationCodeObj = await VerificationCode.create({
			email: email,
			code: verificationCode
		});
	}else{
		verificationCodeObj.code = verificationCode;
		verificationCodeObj.updated_at = Date.now();
		verificationCodeObj.save();
	}
	// console.log(verificationCodeObj);

	// Save the token and email in your database for later verification
	const mailOptions = {
			from: process.env.GMAIL,
			to: email,
			subject: 'Confirm your email address',
			html: `
				<h3>Verify your email</h3>
				<p>Hi,</p>
				<p>Enter this code in the next 5 minutes to sign up:<p>
				<strong>${verificationCode}</strong>
				<p>If you didn't request this code you can safely ignore this email.</p>
				<p>Someone else might have typed your email addess by mistake.</p>
			`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
					console.log(error);
					return res.status(500).send('Error sending verification email.');
			} else {
					console.log('Email sent: ' + info.response);
					return res.send('Verification email sent.');
			}
	});

	return res.send('Verification email sent.');
}


module.exports = { checkRegistrationFormOne, checkRegistrationFormTwo, register, login, validateToken,
	sendVerificationEmail, validateEmailVerificationCode, comparePasswords, hashPassword };
