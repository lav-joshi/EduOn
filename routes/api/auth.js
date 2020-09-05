const express = require("express");
const passport = require("passport");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const router = express.Router();


router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
);

router.get("/google/callback",
passport.authenticate("google", { failureRedirect: "/" }),
    (req,res)=>{
       req.session.token=req.user.accessToken[req.user.accessToken.length - 1];
       res.cookie("token", req.session.token);
       SuperUser.findOne({email:req.user.email},async (err,superuser)=>{
         if(superuser){
            req.session.client = "superuser";
            res.redirect("/superuser/dashboard");
         }else{
             Student.findOne({email:req.user.email},async (err,student)=>{
                 if(student){
                    req.session.client = "student";
                    res.redirect("/student/dashboard");
                }else{
                    Teacher.findOne({email:req.user.email},async (err,teacher)=>{
                        if(teacher){
                            req.session.client = "teacher";
                            res.redirect("/teacher/dashboard");
                        }else{
                            res.redirect("/");
                        }
                    });
                }
             });
         }
       })
});

router.get("/logout",async (req,res)=>{
    if(req.session.client==="student"){
        await Student.updateOne(
            { email: req.user.email },
            { $pull: { accessToken: { $in: [req.session.token] } } }
        );
    }else if(req.session.client==="teacher"){
        await Teacher.updateOne(
            { email: req.user.email },
            { $pull: { accessToken: { $in: [req.session.token] } } }
        );
    }else if(req.session.client==="superuser"){
        await SuperUser.updateOne(
            { email: req.user.email },
            { $pull: { accessToken: { $in: [req.session.token] } } }
        );
    }
    req.logout();
    req.session = null;
    req.token = null;
    res.cookie("token", "");
    res.redirect("/");
});

module.exports = router;

  