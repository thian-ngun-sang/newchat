const mongoose = require("mongoose");

const VerificationCode = mongoose.Schema({
		email: {
			type: String,
			required: [true, "userId cannot not be null"]
		},
    code: {
			type: String,
			required: false
		},
		created_at: {
			type: Date,
			default: Date.now
		},
		updated_at: {
			type: Date,
			default: Date.now
		}
})

module.exports = mongoose.model('VerificationCode', VerificationCode);
