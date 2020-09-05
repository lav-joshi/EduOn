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

module.exports = router;
