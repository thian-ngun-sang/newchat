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
    native: {
        type: String
    },
    address: {
        type: String
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