const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const keys = require("../config/keys");
const Student = require("../models/Student");
const SuperUser = require("../models/SuperUser");
const Teacher = require("../models/Teacher");

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.clientID,
            clientSecret: keys.clientSecret,
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        async function(accessToken, refreshToken, profile, done){
            Student.findOne({email:profile.emails[0].value},async (err,student)=>{
              if(err){
                  return done(err);
              }
              else if(!student){
                SuperUser.findOne({email:profile.emails[0].value},async (err,superuser)=>{
                   if(err){
                       return done(err);
                   }else if(superuser){
                    superuser.accessToken.push(accessToken);
                    await superuser.save();
                    return done(err,superuser);
                   }else if(!superuser){
                       Teacher.findOne({email:profile.emails[0].value},async (err,teacher)=>{
                           if(err){
                               return done(err);
                           }else if(teacher){
                            teacher.accessToken.push(accessToken);
                            await teacher.save();
                            return done(err,teacher);
                           }else{
                               return done(err);
                           }
                       })
                   }
                });
               }
               else if (student) {
                student.accessToken.push(accessToken);
                await student.save();
                return done(err, student);
               }
            });
        }
    )
)

passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  