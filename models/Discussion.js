const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema({
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
    texts:[],
    socketids:[String],
    students:[String]
},
{ timestamps: true });
module.exports = mongoose.model("discussion", DiscussionSchema);
