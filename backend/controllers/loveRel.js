const User = require("../models/User");
const LoveRel = require("../models/LoveRel");

const store = async (req, res) => {
		const { sender, receiver } = req.body;	

		if(!sender || !receiver){
			return res.status(400).json({ msg: "Bad request" });
		}
		if(req.user._id.toString() !== sender){
			return res.status(401).json({ msg: "Unauthorized" });
		}

		const oldLoveRel = await LoveRel.findOne({
			$or: [
				{
					"sender": sender,
					"receiver": receiver
				},
				{
					"sender": receiver,
					"receiver": sender 
				}
			]
		});

		// if there is already love rel between sender and receiver
		if(oldLoveRel){
			return res.status(400).json({ msg: "Old rel already exists" });
		}

		const loveRel = await LoveRel.create({ sender, receiver });

    return res.status(200).json({ msg: "Success", loveRel });
}

const destroy = async (req, res) => {
		if(!req.body.sender){
			return res.status(400).json({ msg: "Sender not specified" });
		}
		if(!req.body.receiver){
			return res.status(400).json({ msg: "Receiver not specified" });
		}

		const query = {
			sender: req.body.sender,
			receiver: req.body.receiver
		}
		// const loveRel = await LoveRel.findOne(query);
		try{
			const result = await LoveRel.deleteOne(query);
			const { deletedCount } = result;
			if(deletedCount === 0){
				return res.status(400).json({ msg: "loveRel with the given data not found" });
			}
		}catch(error){
			console.log(error);
		}

    return res.status(200).json({ msg: "Success" });
}

const patch = async (req, res) => {
		if(!req.body.sender){
			return res.status(400).json({ msg: "Sender not specified" });
		}
		if(!req.body.receiver){
			return res.status(400).json({ msg: "Receiver not specified" });
		}
		if(req.body.status !== "ACCEPTED" && req.body.status !== "REJECTED"){
			return res.status(400).json({ msg: "Invalid love status" });
		}

		const query = {
			sender: req.body.sender,
			receiver: req.body.receiver
		}
		const loveRel = await LoveRel.findOne(query);
		
		loveRel.status = req.body.status;
		await loveRel.save();

    return res.status(200).json({ msg: "Success", loveRel });
}

module.exports = { store, destroy, patch }
