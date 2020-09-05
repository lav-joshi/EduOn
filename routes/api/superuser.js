const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../../middleware/authsuperuser");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const Counsell = require("../../models/Counsell");
const Meeting = require("../../models/Meeting");
const Discussion = require("../../models/Discussion");

const moment = require("moment");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));


router.get("/dashboard",auth,(req,res)=>{
    const scheduledcounsells=[],pastcounsells=[];
    const scheduleddiscussions=[],pastdiscussions=[];
    const scheduledtests=[],pasttests=[];

    Counsell.find({},async(err,arr)=>{
      Teacher.find({},async(err,teachers)=>{
         Student.find({},async(err,students)=>{
            Discussion.find({},async(err,discussions)=>{
               Meeting.find({},async(err,meetings)=>{



                  await discussions.forEach((x)=>{
                     if((new Date()).getTime() <=x.scheduledTime.getTime()){
                        scheduleddiscussions.push(x);
                     }else{
                        pastdiscussions.push(x);
                     }
                  });

                  await meetings.forEach((x)=>{
                     if((new Date()).getTime() <=x.scheduledTime.getTime()){
                        scheduledtests.push(x);
                     }else{
                        pasttests.push(x);
                     }
                  });

                  await arr.forEach((x)=>{
                     if((new Date()).getTime() <=x.scheduledTime.getTime()){
                        scheduledcounsells.push(x);
                     }else{
                        pastcounsells.push(x);
                     }
                  });
               
                  res.render("superuserdashboard",{currentUser:req.user,
                                                   clientType:req.session.client,
                                                   scheduledcounsells:scheduledcounsells,
                                                   pastcounsells:pastcounsells,
                                                   students:students,
                                                   teachers:teachers,
                                                   scheduledtests:scheduledtests,
                                                   pasttests:pasttests,
                                                   scheduleddiscussions:scheduleddiscussions,
                                                   pastdiscussions:pastdiscussions
                                                });
               });
            });
         });
      });
    });
});

router.post("/teacher/add",auth,(req,res)=>{
    console.log(req.body.main);
    Teacher.create(req.body.main,(err,teacher)=>{
        if(err){
           console.log(err);
           res.redirect("/superuser/dashboard");
        }else{
           res.redirect("/superuser/dashboard");
        }
     });
});

router.get("/teacher/remove/:id",auth,(req,res)=>{
   Teacher.findByIdAndDelete(req.params.id,(err,counsell)=>{
     if(err){
        res.redirect("/superuser/dashboard");
     }else{
      res.redirect("/superuser/dashboard");
     }
   });
});


router.post("/student/add",auth,(req,res)=>{
    console.log(req.body.mains);
    Student.create(req.body.mains,(err,student)=>{
        if(err){
            console.log(err);
           res.redirect("/superuser/dashboard");
        }else{
           res.redirect("/superuser/dashboard");
        }
     });
});

router.get("/student/remove/:id",auth,(req,res)=>{
   Student.findByIdAndDelete(req.params.id,(err,counsell)=>{
     if(err){
        res.redirect("/superuser/dashboard");
     }else{
      res.redirect("/superuser/dashboard");
     }
   });
});

router.post("/counsell/add",auth,(req,res)=>{
   console.log(req.body.counsell);
   Counsell.create(req.body.counsell,(err,counsell)=>{
      if(err){
        res.redirect("/superuser/dashboard");
       }else{
        res.redirect("/superuser/dashboard");
       }
   });
});

router.get("/counsell/remove/:id",auth,(req,res)=>{
   Counsell.findByIdAndDelete(req.params.id,(err,counsell)=>{
     if(err){
        res.redirect("/superuser/dashboard");
     }else{
      res.redirect("/superuser/dashboard");
     }
   });
});

///////////////////////
 //Profile Section
///////////////////////

router.get("/profile",auth,(req,res)=>{
   Student.findOne({email:req.query.email},(err,student)=>{
     Discussion.find({},async(err,discussions)=>{
         Meeting.find({},async(err,meetings)=>{
         let attendance=[],graph=[];

             let c=0;
             await discussions.forEach(async (discussion)=>{
                 let y=discussion.students.findIndex(x => x.email == req.query.email);
                 if(y!==-1){
                     attendance.push(discussion);
                     if(discussion.students[y].present === true){
                         c=c+1;
                     }
                 }
             });
             
             await meetings.forEach(async (meeting)=>{
                 let y = meeting.students.indexOf(req.query.email);
                 if(y!==-1){
                     graph.push(meeting);
                 }
             });
             
             let test=[];
             await graph.forEach(async(g)=>{
                 let x={
                   scheduledTime:g.scheduledTime,
                   roomId:g.roomId,
                   totalquestions:g.questions.length,
                 }
               let y= g.intestdetails.findIndex(z=> z.email == req.query.email);
               let count =0;
               await g.intestdetails[y].correct.forEach((ee)=>{
                   if(ee==1){
                       count++;
                   }
               });
               x.correct = count;
               x.percentage = (count/(x.totalquestions)*(1.0))*100;
               test.push(x);
             });
             

             let present=[];
             await attendance.forEach((at)=>{
                 let x={
                     scheduledTime:at.scheduledTime,
                     roomId:at.roomId,
                 }
                 let y=at.students.findIndex(z => z.email ==req.query.email);
                 if(at.students[y].present ==true){
                   x.present=true;
                 }else{
                   x.present=false;
                 }
                 present.push(x);
             });
         
         let totalpercentagepresent= (c/(attendance.length)*(1.0))*100;
         res.render("superuser-studentprofile",{
                 currentUser:req.user,
                 clientType:req.session.client,
                 student:student,
                 present:present,
                 test:test,
                 totalpercentagepresentinclass:totalpercentagepresent});
         });
     });
 });
})


module.exports = router;
