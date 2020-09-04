const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../../middleware/authstudent");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const Meeting = require("../../models/Meeting");
const Discussion = require("../../models/Discussion");
const schedule = require("node-schedule");
const { route } = require("./teacher");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));


router.get("/dashboard",auth,(req,res)=>{

    let errors=[];
    if(req.query.f==0){
        errors.push("You are not allowed to enter test room or room does not exist");
    }
    res.render("studentdashboard",{currentUser:req.user,clientType:req.session.client,errors:errors});
});  

router.get("/dashboard/test/enter",auth,async (req,res)=>{
    
    Meeting.findOne({roomId:req.query.room},async (err,meeting)=>{
        if(err || !meeting){
            res.redirect("/student/dashboard?f=0"); 
        }
        else if(meeting.students.indexOf(req.user.email)===-1){
            res.redirect("/student/dashboard?f=0");
        }else{
            const errors=[];
            if(req.query.f==0){
               errors.push("You can not enter room unless test starts or Either you are late by five minutes and you cannot enter test now.");
            }
            res.render("studenttestroom",{currentUser:req.user,clientType:req.session.client,meeting:meeting,errors:errors});
        }
    });
});

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

router.get("/dashboard/entertestroom/:roomId",auth,async(req,res)=>{
   Meeting.findOne({roomId:req.params.roomId},async(err,meeting)=>{
        if(err){
            res.redirect("/student/dashboard");
        }
        if(meeting.students.indexOf(req.user.email)===-1){
            res.redirect("/student/dashboard");
        }
        else if(((new Date()).getTime() < meeting.scheduledTime.getTime()) || ((new Date()).getTime()>(meeting.scheduledTime.getTime()+300000)) ){
           console.log("You can not enter test now or Either you are late by five minutes and you cannot enter test now.");
           res.redirect(`/student/dashboard/test/enter?room=${req.params.roomId}&f=0`); 
        } 
        else if (meeting.intestemail.indexOf(req.user.email)===-1) {
            const arr=meeting.questions;
            let correct=[];
            let visited=[];
            for(var i=0;i<arr.length;i++){
                correct.push(0);
                visited.push(0);
            }
            visited[0]=1;
            shuffle(arr);
            const obj={
                name:req.user.name,
                email:req.user.email,
                ques:arr,
                intime:Date.now(),
                correct:correct,
                visited:visited,
                currentQuestion:1
            }
            meeting.intestemail.push(req.user.email);
            meeting.intestdetails.push(obj);
            await meeting.save();
            let question1=obj.ques[0];
            res.render("maintestroom",{currentUser:req.user,clientType:req.session.client,meeting:meeting,length:meeting.questions.length,runningquestion:1,question1:question1,repl:"Test is gpoing on"});
        }else{ 
            let x,y,repl="Test is going on ";
            meeting.intestdetails.forEach((obj,index)=>{
                 if(obj.email===req.user.email){
                   obj.ques.forEach((q,i)=>{
                       if(i===obj.currentQuestion-1){
                           y=obj.ques[i];
                           x=i+1;
                       }
                       if(obj.visited[i]==1){
                          repl="Test Over . LeaderBoard will be generated after all participants will finish the test";
                       }
                   });
                }
            });
            res.render("maintestroom",{currentUser:req.user,clientType:req.session.client,meeting:meeting,length:meeting.questions.length,runningquestion:x,question1:y,repl:repl});
        }
   });
});


router.get("/dashboard/getquestion/:roomid/:email/:num",auth,(req,res)=>{
   Meeting.findOne({roomId:req.params.roomid},(err,meeting)=>{
      if(err){
          throw Error(err);
      }else if(((new Date()).getTime() < meeting.scheduledTime.getTime()) || ((new Date()).getTime()>(meeting.scheduledTime.getTime()+meeting.questions.length*120000+300000)) ){
         res.redirect("/student/dashboard");
      }
      else if(meeting.students.indexOf(req.params.email)!==-1){
        if(meeting.intestemail.indexOf(req.params.email)!==-1){
            
            let q,ii=-1;
            meeting.intestdetails.forEach((p,indice)=>{
                if(p.email===req.params.email){
                    // q=p.ques;
                    ii=indice;
                }
            });
          
         if(ii!=-1){
          
           meeting.intestdetails[ii].ques.forEach((qq,j)=>{
                if(j==Number(req.params.num)-1){
                    q=qq;
                    meeting.intestdetails[ii].visited.set(j,1);
                    meeting.save().then((data)=>{
                    }).catch((e)=>{
                        console.log(e);
                    });
                }
           })
         }
        
        res.send({questionname:q.question,optionA:q.option1,optionB:q.option2,optionC:q.option3,optionD:q.option4})
           
        }else{
            res.redirect("/student/dashboard");
        }
      }else{
          res.redirect("/student/dashboard"); 
      }
   });
});

router.get("/dashboard/updatequestionnumber/:roomid/:email/:num",auth,(req,res)=>{
    Meeting.findOne({roomId:req.params.roomid},async (err,meeting)=>{
       if(err){
           throw Error(err);
       }else if(meeting.students.indexOf(req.params.email)!==-1){
           if(meeting.intestemail.indexOf(req.params.email)!==-1){
               let i=-1
               meeting.intestdetails.forEach(async (p,index)=>{
                   if(p.email===req.params.email){
                       i=index
                   }
               });
               if(i!==-1){
                   try{
                    meeting.intestdetails[i].currentQuestion=Number(req.params.num);
                    meeting.save().then((data)=>{
                        // console.log(data);
                    }).catch(e=>{
                        console.log(e);
                    }) 
                   }catch(e){ 
                       console.log(e);
                   } 
                   res.send({x:"Helo"})
               }
           }
       } 
    });  
});

router.get("/dashboard/updatemarks/:roomid/:email/:questionname/:answer",auth,(req,res)=>{
    Meeting.findOne({roomId:req.params.roomid},async(err,meeting)=>{
      if(err){
          throw Error(err);
      }else if(meeting.students.indexOf(req.params.email)!==-1){
         if(meeting.intestemail.indexOf(req.params.email)!==-1){
            console.log("fuck you");
             let i=-1;
            meeting.intestdetails.forEach((p,index)=>{
                if(p.email===req.params.email){
                  i=index;
                }
            });
            console.log(i);
            if(i!==-1){
               let j=-1;
               let flag=0;
               meeting.intestdetails[i].ques.forEach((q,im)=>{
                    if(q.question == req.params.questionname){
                        j=im;
                        if(q.answer==req.params.answer){
                            flag=1;
                        }
                    }
               });
               console.log(j);
               console.log(flag);
              if(j!=-1 && flag==1) {
                meeting.intestdetails[i].correct.set(j,1);
                meeting.save().then((data)=>{
                    console.log(data.intestdetails[0].correct);
                }).catch((e)=>{
                    console.log(e);
                })
              }else if(j!=-1 && flag==0){
                    meeting.intestdetails[i].correct.set(j,-1);
                    meeting.save().then((data)=>{
                        console.log(data.intestdetails[0].correct);
                    }).catch((e)=>{
                        console.log(e);
                    })
              }
            }
        }
      }
    });
});

router.get("/dashboard/leaderboard/:roomid",auth,async(req,res)=>{
    console.log("body fuck");
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
});

///////////////////////////////////////////////
///////////////////////////////////////////////
            //Discusson Routes
///////////////////////////////////////////////
///////////////////////////////////////////////

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
});



module.exports = router;
