const mongoose = require("mongoose");

const LoveRel = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
		receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
		},
		status: {
				type: String,
				default: "PENDING"	// ACCEPTED, REJECTED
		},
    created_at: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("LoveRel", LoveRel);
