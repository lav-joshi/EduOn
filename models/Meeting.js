const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    admin: {
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    scheduledTime:{
        type:Date
    },
    roomId:{
        type:String
    },
    students:[String]
},
{ timestamps: true });
module.exports = mongoose.model("meeting", MeetingSchema);
