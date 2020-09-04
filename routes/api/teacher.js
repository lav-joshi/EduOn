const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../../middleware/authteacher");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const Meeting = require("../../models/Meeting");
const Discussion= require("../../models/Discussion");

const nodemailer=require("nodemailer");
const router = express.Router();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'joshilav18032002@gmail.com',
        pass:'lav@joshi10566'
    }
});

router.use(bodyParser.urlencoded({ extended: true }));


router.get("/dashboard",auth,(req,res)=>{
    Meeting.find({email:req.user.email},(err,meetings)=>{
        Discussion.find({email:req.user.email},(err,discussions)=>{
            res.render("teacherdashboard",{currentUser:req.user,
                clientType:req.session.client,
                meetings:meetings,
                discussions:discussions
            });
        });
    });
});

router.post("/meeting/add",auth,(req,res)=>{
    Meeting.create(req.body.meeting,(err,meeting)=>{
        if(err){
            res.redirect("/teacher/dashboard");
        }else{
            res.redirect("/teacher/dashboard");
        }
    });
});

router.get("/dashboard/:roomId",auth,(req,res)=>{
    Meeting.findOne({roomId:req.params.roomId},async (err,meeting)=>{
      Student.find({},async (err,students)=>{
        res.render("meetingdetails",{currentUser:req.user,
                                     clientType:req.session.client,
                                     meeting:meeting,
                                     students:students});
      });
    });
});


router.post("/dashboard/:roomId",auth,async (req,res)=>{

   Meeting.findOne({roomId:req.params.roomId},async (err,meeting)=>{
       try{
        if(Array.isArray(req.body.main)){
            meeting.students=await meeting.students.concat(req.body.main);
            await meeting.save();
            req.body.main.forEach(student => {
                var mailOptions ={
                    from:'joshilav18032002@gmail.com',
                    to:student,
                    subject:"Hi , testing purpose",
                    text: meeting.admin+" invites youto give the scheduled exam with roomId "+meeting.roomId+" at timings "
                };
                transporter.sendMail(mailOptions,function(err,info){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("Email Sent");
                    }
                });
            });
        }
        else{
            await meeting.students.push(req.body.main);
            await meeting.save();
            var mailOptions ={
                from:'joshilav18032002@gmail.com',
                to:req.body.main,
                subject:"Hi , testing purpose",
                text: meeting.admin+" invites youto give the scheduled exam with roomId "+meeting.roomId+" at timings "
            };
            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err)
                }else{
                    console.log("Email Sent");
                }
            });
        }
       }catch(e){
           console.log(e);
       } 
     
   });
   res.redirect("/teacher/dashboard/"+req.params.roomId);
});


router.post("/discussion/add",auth,(req,res)=>{
    Discussion.create(req.body.discussion,(err,discussion)=>{
        if(err){
            res.redirect("/teacher/dashboard");
        }else{
            res.redirect("/teacher/dashboard");
        }
    });
})

router.get("/dashboard/enter/discussion",auth,(req,res)=>{
    Discussion.findOne({roomId:req.query.room},async (err,discussion)=>{
        Student.find({},async (err,students)=>{
          res.render("discussiondetails",{currentUser:req.user,
                                       clientType:req.session.client,
                                       discussion:discussion,
                                       students:students,
                                       texts:discussion.texts});
        });
      });
});




router.post("/dashboard/discussion/:roomId",auth,async(req,res)=>{
    Discussion.findOne({roomId:req.params.roomId},async (err,discussion)=>{
        try{
         if(Array.isArray(req.body.main)){
             discussion.students=await discussion.students.concat(req.body.main);
             await discussion.save();
             req.body.main.forEach(student => {
                 var mailOptions ={
                     from:'joshilav18032002@gmail.com',
                     to:student,
                     subject:"Hi , testing purpose",
                     text: discussion.admin+" invites youto give the scheduled exam with roomId "+discussion.roomId+" at timings "
                 };
                 transporter.sendMail(mailOptions,function(err,info){
                     if(err){
                         console.log(err)
                     }else{
                         console.log("Email Sent");
                     }
                 });
             });
         }
         else{
             await discussion.students.push(req.body.main);
             await discussion.save();
             var mailOptions ={
                 from:'joshilav18032002@gmail.com',
                 to:req.body.main,
                 subject:"Hi , testing purpose",
                 text: discussion.admin+" invites youto give the scheduled exam with roomId "+discussion.roomId+" at timings "
             };
             transporter.sendMail(mailOptions,function(err,info){
                 if(err){
                     console.log(err)
                 }else{
                     console.log("Email Sent");
                 }
             });
         }
        }catch(e){
            console.log(e);
        } 
      
    });
    res.redirect("/teacher/dashboard/enter/discussion?room="+req.params.roomId+"&user="+req.user.email);
})
module.exports = router;
