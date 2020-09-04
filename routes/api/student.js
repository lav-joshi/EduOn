const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../../middleware/authstudent");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const Meeting = require("../../models/Meeting");
const Discussion = require("../../models/Discussion");

const { route } = require("./teacher");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));


router.get("/dashboard",auth,(req,res)=>{
    res.render("studentdashboard",{currentUser:req.user,clientType:req.session.client});
});

router.post("/dashboard/test/enter",auth,async (req,res)=>{
    Meeting.findOne({roomId:req.body.room},async (err,meeting)=>{
        if(err){
            res.redirect("/student/dashboard");
        }
        if(meeting.students.indexOf(req.user.email)===-1){
            // Issue number 1
            res.redirect("/student/dashboard");
        }else{
            res.render("studenttestroom",{currentUser:req.user,clientType:req.session.client,meeting:meeting});
        }
    });
});

router.get("/dashboard/discussion/enter",auth,async(req,res)=>{
    Discussion.findOne({roomId:req.query.room},async (err,discussion)=>{
        if(err){
            res.redirect("/student/dashboard");
        }
        if(discussion.students.indexOf(req.query.user)===-1){
            // Issue number 1
            res.redirect("/student/dashboard");
        }else{
            // res.redirect("/student/dashboard/dicussion/:"+req.query.room);
            res.render("studentdiscussionroom",{currentUser:req.user,clientType:req.session.client,discussion:discussion,texts:discussion.texts});
        }
    });
})

// router.get("/dashboard/dicussion/:roomId",auth,async(req,res)=>{ 

// })



module.exports = router;
