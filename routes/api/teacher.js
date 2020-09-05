const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../../middleware/authteacher");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const Meeting = require("../../models/Meeting");
const Discussion= require("../../models/Discussion");
const schedule = require("node-schedule");
const nodemailer=require("nodemailer");
const router = express.Router();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'joshilav18032002@gmail.com',
        pass:'Lavjoshi@1056'
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


router.post("/meeting/updatetiming/:roomid",auth,(req,res)=>{
    console.log(req.body.editscheduledtime);
    Meeting.findOne({roomId:req.params.roomid},async(err,meeting)=>{
      if(meeting.email == req.user.email){
        meeting.scheduledTime=req.body.editscheduledtime;
        await meeting.save();
      }
    });

    res.redirect("/teacher/dashboard/meeting/"+req.params.roomid);
});

router.get("/dashboard/delete/student/:roomid/:email",auth,async (req,res)=>{
  Meeting.findOne({roomId:req.params.roomid},async(err,meeting)=>{
      if(err || !meeting){
         res.redirect("/teacher/dashboard/meeting/"+req.params.roomid)
      }else if(meeting.email == req.user.email){
          let x=meeting.students.indexOf(req.params.email);
          if(x!==-1){
              meeting.students.splice(x,1);
              await meeting.save();
          }
          res.redirect("/teacher/dashboard/meeting/"+req.params.roomid)
      }
  })
})

router.get("/dashboard/meeting/:roomId",auth,(req,res)=>{ ///////////////////////////////////
    console.log("fuck hard");
    Meeting.findOne({roomId:req.params.roomId},async(err,meeting)=>{
      Student.find({},async(err,students)=>{
        res.render("meetingdetails",{currentUser:req.user,
                                     clientType:req.session.client,
                                     meeting:meeting,
                                     students:students,
                                     questions:meeting.questions});
      });
    });  
});

router.post("/dashboard/question/:roomId",auth,(req,res)=>{
   
    Meeting.findOne({roomId:req.params.roomId},async(err,meeting)=>{
        meeting.questions.push(req.body);
        await meeting.save();
    })
    res.redirect("/teacher/dashboard/meeting/"+req.params.roomId);
});

router.get("/dashboard/question/delete/:ques/:roomId",auth,async(req,res)=>{
  Meeting.findOne({roomId:req.params.roomId},async (err,meeting)=>{
    const index = meeting.questions.findIndex(x => x.question === req.params.question);
    meeting.questions.splice(index,1);
    await meeting.save();
  });
  res.redirect("/teacher/dashboard/meeting/"+req.params.roomId);
});

router.post("/dashboard/:roomId",auth,async (req,res)=>{

   Meeting.findOne({roomId:req.params.roomId},async (err,meeting)=>{
       try{
        if(Array.isArray(req.body.main)){
            meeting.students=await meeting.students.concat(req.body.main);
            await meeting.save();
            // req.body.main.forEach(student => {
            //     var mailOptions ={
            //         from:'joshilav18032002@gmail.com',
            //         to:student,
            //         subject:"Hi , testing purpose",
            //         text: meeting.admin+" invites youto give the scheduled exam with roomId "+meeting.roomId+" at timings "
            //     };
            //     transporter.sendMail(mailOptions,function(err,info){
            //         if(err){
            //             console.log(err)
            //         }else{
            //             console.log("Email Sent");
            //         }
            //     });
            // });
        }
        else{
            await meeting.students.push(req.body.main);
            await meeting.save();
            // var mailOptions ={
            //     from:'joshilav18032002@gmail.com',
            //     to:req.body.main,
            //     subject:"Hi , testing purpose",
            //     text: meeting.admin+" invites youto give the scheduled exam with roomId "+meeting.roomId+" at timings "
            // };
            // transporter.sendMail(mailOptions,function(err,info){
            //     if(err){
            //         console.log(err)
            //     }else{
            //         console.log("Email Sent");
            //     }
            // });
        }
       }catch(e){
           console.log(e);
       } 
     
   });
   res.redirect("/teacher/dashboard/meeting/"+req.params.roomId);
});


router.get("/dashboard/meeting/sendmail/:roomid/:email",auth,(req,res)=>{
    Meeting.findOne({roomId:req.params.roomid},(err,meeting)=>{
        if(err){
            res.redirect("/teacher/dashboard/meeting/"+req.params.roomid);
        }else if(req.params.email == meeting.email){
            meeting.students.forEach((stud)=>{
                var mailOptions ={
                    from:'joshilav18032002@gmail.com',
                    to:stud,
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
            res.redirect("/teacher/dashboard/meeting/"+req.params.roomid);
        }
    });
});

router.get("/dashboard/leaderboard/:roomid",auth,(req,res)=>{
    Meeting.findOne({roomId:req.params.roomid},async(err,meeting)=>{
        let students=meeting.students;
        let totalmarks=[];
        for(var i=0;i<students.length;i++){
          totalmarks.push(0);
        }
        let arr=[];
         meeting.questions.forEach((p,i)=>{
           let x=[];
           meeting.intestdetails.forEach((q,j)=>{
             q.ques.forEach((r,k)=>{
                 if(r.question == p.question && q.correct[k]==1){
                    x.push(q.email);
                 }
             });
           });

           x.forEach((y)=>{
               students.forEach((st,p)=>{
                   if(st==y){
                       totalmarks[p]=totalmarks[p]+1;
                   }
               })
           });
           arr.push(x);
         });
       

       res.send({students:students,totalmarks:totalmarks,arr:arr});
   });
})



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
  //Discussion Routes
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////



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
    console.log("madar");
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


router.get("/dashboard/enter/discussion/classroom/:roomid",(req,res)=>{
  Discussion.findOne({roomId:req.params.roomid},(err,discussion)=>{
    res.render("mainclassroom",{currentUser:req.user,clientType:req.session.client,discussion:discussion})
  });
});



router.post("/dashboard/discussion/:roomId",auth,async(req,res)=>{
    Discussion.findOne({roomId:req.params.roomId},async (err,discussion)=>{
        try{
         if(Array.isArray(req.body.main)){
            //  discussion.students=await discussion.students.concat(req.body.main);
            //  await discussion.save();
             req.body.main.forEach((stud)=>{
               let x={
                   email:stud,
                   present:false
               }
               discussion.students.push(x);
             });
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
             let y={
                 email:req.body.main,
                 present:false
             }
             await discussion.students.push(y);
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
