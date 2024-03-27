const mongoose = require("mongoose");

const BlackListRel = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
		receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
		},
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("BlackListRel", BlackListRel);
