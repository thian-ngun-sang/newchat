const mongoose = require("mongoose");

const ChatItem = mongoose.Schema({
    chatboxId: {
        type: String,
        required: [true, "chatBoxId cannot not be null"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
		consumedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
		},
    message: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("ChatItem", ChatItem);
