const { comparePasswords, hashPassword } = require('./auth');

const mongoose = require("mongoose");

const User = require("../models/User");
const LoveRel = require("../models/LoveRel");
const AdditionalUserInfo = require("../models/AdditionalUserInfo");

const index = async (req, res) => {
		let query = {};

		// exclude current user
		if(req.query["-current_user_id"]){
			query = { 
				...query,
				_id : {
					$ne: req.query["-current_user_id"]
				}
			};
		}

    // const users = await User.find(query, "-__v -password -updated_at");

		// const users = await User.aggregate([
		// 	{
		// 		$project: {
		// 			password: 0,
		// 			updated_at: 0,
		// 			created_at: 0
		// 		}
		// 	},
		// 	{
		// 		$match: {
		// 			_id: {
		// 				$ne: new mongoose.Types.ObjectId(req.query["-current_user_id"])
		// 			}
		// 		}
		// 	},
		// 	{ 
		// 		$lookup: {
    //        	from: "loverels",
    //        	localField: "_id",
    //        	foreignField: "sender",
    //        	as: "loveRel"
    //     }
		// 	},
		// 	{ 
		// 		$lookup: {
    //        	from: "loverels",
    //        	localField: "_id",
    //        	foreignField: "receiver",
    //        	as: "loveRel"
    //     }
		// 	}
		// ]).then(res => res);
		// console.log(result);

		const users = await User.aggregate([
			{
				$project: {
					password: 0,
					updated_at: 0,
					created_at: 0
				}
			},
			{
				$match: {
					_id: {
						$ne: new mongoose.Types.ObjectId(req.query["-current_user_id"])
					}
				}
			},
			{ 
				$lookup: {
           	from: "loverels",
						pipeline: [
							{
								$match: {
									$or: [
										{
											"receiver": new mongoose.Types.ObjectId(req.query["-current_user_id"])
										},
										{
											"sender": new mongoose.Types.ObjectId(req.query["-current_user_id"])
										}
									]
								}
							}
						],
           	as: "loveRel"
        }
			},
			{ 
				$lookup: {
           	from: "blacklistrels",
						pipeline: [
							{
								$match: {
									$or: [
										{
											"receiver": new mongoose.Types.ObjectId(req.query["-current_user_id"])
										},
										{
											"sender": new mongoose.Types.ObjectId(req.query["-current_user_id"])
										}
									]
								}
							}
						],
           	as: "blacklistrel"
        }
			},
			{
				$set: {
					'loveRel': { $first: '$loveRel' }
				}
			}
			
		]).then(res => res);

    return res.status(200).json({ msg: "Success", users });
}

const show = async (req, res) => {
		const { userid } = req.params;
    // const user = await User.findById(userid, "-__v -password -updated_at");

		const user = await User.aggregate([
			{
				$project: {
					__v: 0,
					password: 0,
					updated_at: 0,
					created_at: 0
				}
			},
			{
				$match: {
					_id: {
						$eq: new mongoose.Types.ObjectId(userid)
					}
				}
			},
			{ 
				$lookup: {
           	from: "loverels",
						pipeline: [
							{
								$match: {
									$or: [
										{
											"receiver": req.user._id
										},
										{
											"sender": req.user._id
										}
									]
								}
							}
						],
           	as: "loveRel"
        }
			},
			{ 
				$lookup: {
           	from: "blacklistrels",
						pipeline: [
							{
								$match: {
									$or: [
										{
											"sender": new mongoose.Types.ObjectId(userid),
											"receiver": req.user._id
										},
										{
											"sender": req.user._id,
											"receiver": new mongoose.Types.ObjectId(userid)
										}
									]
								}
							}
						],
           	as: "blacklistrel"
        }
			},
			{
				$lookup: {
           	from: "additionaluserinfos",
						localField: "_id",
						foreignField: "userId",
           	as: "additionalUserInfo"
        }
			}, {
				$set: {
					'loveRel': { $first: '$loveRel' },
					'blackListRel': { $first: '$blacklistrel' },
					'additionalUserInfo': { $first: '$additionalUserInfo' }
				}
			},
		]).then(res => res[0]);

    return res.status(200).json({ msg: "Success", user });
}

const account = async (req, res) => {
    const userId = req.user._id.toString();
    // const user = await User.findById(userId, "-__v -password -updated_at");
		
		const user = await User.aggregate([
			{
				$project: {
					__v: 0,
					password: 0,
					updated_at: 0,
					created_at: 0
				}
			},{
				$match: {
					_id: {
						$eq: req.user._id
					}
				}
			}
		]);

		console.log(user, "haha");

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

	console.log(userid);
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

const updateProfileImage = async (req, res) => {
    const user = req.user;
    const file = req.file;
    
    user.profile_image = file.filename;
    user.save();

		let additionalUserInfo = await AdditionalUserInfo.findOne({ userId: user._id });
		if(!additionalUserInfo){
			additionalUserInfo = await AdditionalUserInfo.create({
				userId: user._id.toString(),
				profileImages: [ user.profile_image ]
			});
		}else{
			if(Array.isArray(additionalUserInfo.profileImages)){
				additionalUserInfo.profileImages.push(user.profile_image);
			}else{
				additionalUserInfo.profileImages = [user.profile_image];
			}
			additionalUserInfo.save();
		}

    return res.status(200).json({ msg: "Profile image has been updated",
			profileImage: user.profile_image, profileImages: additionalUserInfo.profileImages
		});
}

const updateCoverImage = async (req, res) => {
    const user = req.user;
    const file = req.file;

    user.cover_image = file.filename;

		let additionalUserInfo = await AdditionalUserInfo.findOne({ userId: user._id });
		if(!additionalUserInfo){
			additionalUserInfo = await AdditionalUserInfo.create({
				userId: user._id.toString(),
				coverImages: [ user.cover_image ]
			});
		}else{
			if(Array.isArray(additionalUserInfo.coverImages)){
				additionalUserInfo.coverImages.push(user.cover_image);
			}else{
				additionalUserInfo.coverImages = [user.cover_image];
			}
			additionalUserInfo.save();
		}

    user.save();
    return res.status(200).json({ msg: "Cover image has been updated",
			coverImage: user.cover_image, coverImages: additionalUserInfo.coverImages });
}

const addMoreAboutUser = (req, res) => {
		const user = req.user;
		let { sexualOrientation, profession, relationshipStatus, idealRelationship, languages } = req.body;

		idealRelationship = idealRelationship.map(item => item.trim());
		languages = languages.map(item => item.trim());

		user.overviewInfo = { sexualOrientation, profession, relationshipStatus, idealRelationship, languages: languages };
		console.log(user);

		user.save();
    return res.status(200).json({ msg: "Success" });
}

const addBioInfo = (req, res) => {
		const user = req.user;
		const { height, weight } = req.body;

		user.bioInfo = { height, weight };
		user.save()
    return res.status(200).json({ msg: "Success" });
}

module.exports = { index, show, updateAccount, updatePassword, updateProfileImage, updateCoverImage, addMoreAboutUser,
	addBioInfo, account, peerAccount };
