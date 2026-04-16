const mongoose = require("mongoose");
const { response } = require("../app");

const profileRoutes = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    gender: String,
    gender_probability: Number,
    sample_size: Number,
    age: Number,
    age_group: String,
    country_id: String,
    country_probability: Number,
    created_at: {
        type: Date,
        default: () => new Date() 
    }
});

module.exports = mongoose.model("Profile", profileRoutes);