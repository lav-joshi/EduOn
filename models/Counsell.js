const mongoose = require("mongoose");

const CounsellSchema = new mongoose.Schema({
    name: {
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
    phoneNumber:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    studentname:{
       type:String,
    },
    studentemail:{
        type:String,
    },
    reserved:{
        type:Boolean,
        default:false
    }
},
{ timestamps: true });
module.exports = mongoose.model("counsell", CounsellSchema);
