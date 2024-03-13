const mongoose = require("mongoose");

const Lovebox = mongoose.Schema({
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Lovebox", Lovebox);
