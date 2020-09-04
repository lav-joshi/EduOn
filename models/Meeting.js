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
    students:[String],
    questions:[{
        question:{
          type:String,
          trim:true
        },
        option1:{
            type:String,
            trim:true
        },
        option2:{
            type:String,
            trim:true
        },
        option3:{
            type:String,
            trim:true
        },
        option4:{
            type:String,
            trim:true
        },
        answer:{
            type:String,
            trim:true
        }
    }],
    intestdetails:[{
        name:{
            type:String,
            trim:true
        },
        email:{
            type:String,
            trim:true
        },
        ques:[{
            question:{
              type:String,
              trim:true
            },
            option1:{
                type:String,
                trim:true
            },
            option2:{
                type:String,
                trim:true
            },
            option3:{
                type:String,
                trim:true
            },
            option4:{
                type:String,
                trim:true
            },
            answer:{
                type:String,
                trim:true
            }
        }],
        intime:{
            type:Date,
            trim:true
        },
        correct:[Number],
        visited:[Number],
        currentQuestion:{
            type:Number,
            trim:true
        }
    }],
    intestemail:[String]
},
{ timestamps: true },
{strict:false});
module.exports = mongoose.model("meeting", MeetingSchema);
