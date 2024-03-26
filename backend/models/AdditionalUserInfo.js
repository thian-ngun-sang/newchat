const mongoose = require("mongoose");

const AdditionalUserInfo = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    coverImages: {
			type: [String],
			default: []
		},
		profileImages: {
			type: [String],
			default: []
		},
    locations: {
			type: [
				{ 
					passCode: String,
					zipCode: String,
					geometry: String
				}
			],
			default: []
		}
		
})

module.exports = mongoose.model('AdditionalUserInfo', AdditionalUserInfo);
