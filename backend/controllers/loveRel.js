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

		LoveRel.create({ sender, receiver });

    return res.status(200).json({ msg: "Success" });
}

module.exports = { store }
