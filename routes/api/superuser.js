const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../../middleware/authsuperuser");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));


router.get("/dashboard",auth,(req,res)=>{
    res.render("superuserdashboard",{currentUser:req.user,clientType:req.session.client});
})

router.post("/teacher/add",(req,res)=>{
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

router.post("/student/add",(req,res)=>{
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

module.exports = router;
