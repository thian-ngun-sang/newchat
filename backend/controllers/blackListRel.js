const BlackListRel = require("../models/BlackListRel");

const store = async (req, res) => {
		const { sender, receiver } = req.body;	

		if(!sender || !receiver){
			return res.status(400).json({ msg: "Bad request" });
		}
		if(req.user._id.toString() !== sender){
			return res.status(401).json({ msg: "Unauthorized" });
		}

		const oldBlackListRel = await BlackListRel.findOne({
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
		if(oldBlackListRel){
			return res.status(400).json({ msg: "Old rel already exists" });
		}

		const blackListRel = await BlackListRel.create({ sender, receiver });

    return res.status(200).json({ msg: "Success", blackListRel });
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
		// const blackListRel = await BlackListRel.findOne(query);
		try{
			const result = await BlackListRel.deleteOne(query);
			const { deletedCount } = result;
			if(deletedCount === 0){
				return res.status(400).json({ msg: "blackListRel with the given data not found" });
			}
		}catch(error){
			console.log(error);
		}

    return res.status(200).json({ msg: "Success" });
}

module.exports = { store, destroy }
