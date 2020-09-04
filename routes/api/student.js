const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../../middleware/authstudent");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const Meeting = require("../../models/Meeting");
const { route } = require("./teacher");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));


router.get("/dashboard",auth,(req,res)=>{
    res.render("studentdashboard",{currentUser:req.user,clientType:req.session.client});
});

router.post("/dashboard/enter",auth,async (req,res)=>{
    Meeting.findOne({roomId:req.body.room},async (err,meeting)=>{
        if(err){
            res.redirect("/student/dashboard");
        }
        if(meeting.students.indexOf(req.user.email)===-1){
            // Issue number 1
            res.redirect("/student/dashboard");
        }else{
            res.render("studentroom",{currentUser:req.user,clientType:req.session.client,meeting:meeting});
        }
    });
});



module.exports = router;
