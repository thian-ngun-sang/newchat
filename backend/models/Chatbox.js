const mongoose = require("mongoose");

const ChatBox = mongoose.Schema({
    created_at: {
        type: Date,
        default: new Date()
    }
});

const ChatboxSchema = mongoose.Schema({
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
		type: {
			type: String,
			default: "ONE_TO_ONE"
		},
    created_at: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("ChatBox", ChatboxSchema);
