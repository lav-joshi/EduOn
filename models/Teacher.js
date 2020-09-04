const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    accessToken: [String],
    name: {
    type: String,
    trim: true,
    required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    displayPicture: {
        type: String,
        trim: true
    },
});

const Teacher = mongoose.model("teacher", TeacherSchema);
module.exports = Teacher;

