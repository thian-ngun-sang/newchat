const { comparePasswords, hashPassword } = require('./auth');

const User = require("../models/User");

const index = async (req, res) => {
    const users = await User.find({}, "-__v -password -updated_at");

    return res.status(200).json({ msg: "Success", users });
}

const show = async (req, res) => {
		const { userid } = req.params;
    const user = await User.findById(userid, "-__v -password -updated_at");

    return res.status(200).json({ msg: "Success", user });
}

const account = async (req, res) => {
    const userId = req.user._id.toString();
    const user = await User.findById(userId, "-__v -password -updated_at");

    return res.status(200).json({ msg: "Success", user });
}

const peerAccount = async(req, res) => {
	const { userid } = req.params;

	let user;
	try{
		user = await User.findById(userid, "-__v -password -updated_at -user_name");
	}catch(error){
		return res.status(404).json({ msg: "User not found" });
	}

	return res.status(200).json({ user: user });
}

const updateAccount = async(req, res) => {
    const user = req.user;
    const { first_name, last_name, user_name, email, phone, gender, currentLocation } = req.body;

    if(first_name === "" || first_name === undefined || first_name === null){
        return res.status(400).json({ msg: "Firstname cannot be empty" });
    }
    if(user_name === "" || user_name === undefined || user_name === null){
        return res.status(400).json({ msg: "Username cannot be empty" });
    }
    if(email === "" || email === undefined || email === null){
        return res.status(400).json({ msg: "Email cannot be empty" });
    }

    // sameUsername: user with same username
    // const sameUsername = await User.findOne({ user_name: user_name });
    // if(sameUsername !== null && sameUsername !== undefined){
    //     if(sameUsername._id.toString() !== user._id.toString()){
    //         return res.status(400).json({ msg: "User with that username already exist" });
    //     }
    // }

    // sameEmail: user with same email
    const sameEmail = await User.findOne({ email: email });
    if(sameEmail !== null && sameEmail !== undefined){
        if(sameEmail._id.toString() !== user._id.toString()){
            return res.status(400).json({ msg: "User with that email already exist" });
        }
    }

    user.first_name = first_name;
    user.last_name = last_name;
    user.user_name = user_name;
    user.email = email;
    user.phone = phone;
    user.gender = gender;
    user.currentLocation = currentLocation;

    user.save();
    return res.status(200).json({ msg: "Success", user });
}

const updatePassword = async(req, res) => {
	const { oldPassword, newPassword, confirmPassword } = req.body;

	if(newPassword !== confirmPassword){
		return res.status(400).json({ msg: "Passwords do not match" });
	}

  const userId = req.user._id.toString();
	let user;
	try{
  	user = await User.findById(userId, "password");
	}catch(error){
		return res.status(400).json({ msg: "Bad request" });
	}

	let passwordStatus;
	try{
		passwordStatus = await comparePasswords(user.password, oldPassword);
	}catch(error){
		return res.status(400).json({ msg: "Incorrect old password" });
	}

	let newHashedPassword;
	if(passwordStatus){
		try{
			newHashedPassword = await hashPassword(newPassword);
		}catch(error){
			return res.status(400).json({ msg: "Bad request" });
		}
	}

	if(newHashedPassword){
		user.password = newHashedPassword;
		user.save();
	}
	return res.status(200).json({ msg: "Password changed successfully" });
}

const updateProfileImage = (req, res) => {
    const user = req.user;
    const file = req.file;
    
    user.profile_image = file.filename;
    user.save();
    return res.status(200).json({ msg: "Profile image has been updated", profileImage: user.profile_image });
}

const updateCoverImage = (req, res) => {
    const user = req.user;
    const file = req.file;

    user.cover_image = file.filename;
		console.log(file.filename);

    user.save();
    return res.status(200).json({ msg: "Cover image has been updated", coverImage: user.cover_image });
}

module.exports = { index, show, updateAccount, updatePassword, updateProfileImage, updateCoverImage, account, peerAccount };
