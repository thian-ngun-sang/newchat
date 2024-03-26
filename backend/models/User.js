const mongoose = require("mongoose");

const User = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First name cannot not be null"]
    },
    last_name: {
        type: String,
        required: false
    },
    user_name: {
        type: String,
        trim: true,
        required: [true, "Username cannot be null"]
    },
    profile_image: {
        type: String
    },
    cover_image: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email cannot be null"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password cannot be null"],
        trim: true
    },
    phone: {
        type: String,
        maxlength: [15, "Phone number cannot be longer than 10 characters"],
    },
    gender: {
        type: String,
        maxlength: [20, "Gender cannot be longer than 20 characters"],
    },
    greeting: {
        type: String
    },
		dateOfBirth: {
				type: String
		},
    placeOfBirth: {
        type: String
    },
    currentLocation: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Location"
        type: String
    },
		overviewInfo: {
			type: {
				sexualOrientation: String,
				profession: String,
				relationshipStatus: String,
				idealRelationship: [String],
				languages: [String]
			}
		},
		bioInfo: {
			type: {
				height: {
					type: Number,
					min: 0.0,  // Minimum value for the float
					max: 500.0, // Maximum value for the float
				},
				weight: Number
			}
		},
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('User', User);
