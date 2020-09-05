const http= require("http");
const express = require("express");
const path=require("path");
const socketio = require("socket.io");
const keys = require("./config/keys");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
require("./db/mongoose");
const student = require("./routes/api/student");
const teacher = require("./routes/api/teacher"); 
const superuser = require("./routes/api/superuser");
const authRoutes = require("./routes/api/auth");
const passport = require("passport");
const cron = require("node-cron");
const Discussion = require("./models/Discussion");
const SuperUser = require("./models/SuperUser");
const Teacher = require("./models/Teacher");
const Student = require("./models/Student");

const app=express();
const PORT = process.env.PORT || 3000;

const server=http.createServer(app)
const io = socketio(server);

app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static("./assets"));
app.use(
    cookieSession({
      name: "session",
      keys: [keys.sessionSecret]
    })
  );
app.locals.moment = require("moment");
app.use(cookieParser());


require("./middleware/PassportMiddleware");

app.use(passport.initialize());

app.use(passport.session());

app.get("/",(req,res)=>{
  if (req.session.token == null) {
    res.render("home", {
      currentUser: req.user,
      clientType: req.session.client
    });
  }else{
    SuperUser.findOne({email:req.user.email},(err,superuser)=>{
      if(err) Error(err);
      if(superuser){
          res.redirect("/superuser/dashboard");
      }else{
        Teacher.findOne({ email: req.user.email }, function (err, teacher) {
          if (err) Error(err);
          if (teacher) {
            res.redirect("/teacher/dashboard");
          } else {
            res.redirect("/student/dashboard");
          }
        });
      }
    })
  }
});


app.use("/student", student);
app.use("/teacher", teacher);
app.use("/superuser", superuser);
app.use("/auth", authRoutes);

io.on('connection',(socket)=>{
    console.log("New Web Socket Connection");
    
    socket.on('join',({useremail,room},callback)=>{

        socket.join(room);   
        Discussion.findOne({roomId:room},async (err,discussion)=>{
          discussion.socketids.push(socket.id);
          await discussion.save();  
        }); 

    }); 

    socket.on('sendMessage',(msg,callback)=>{
      msg.createdAt=new Date().getTime();

        Discussion.findOne({roomId:msg.roomId},async (err,discussion)=>{
          discussion.texts.push(msg);
          await discussion.save();

          discussion.socketids.forEach((id)=>{
            io.to(id).emit('message',msg);
          });
        }); 
      callback();

    });

    socket.on('disconnect',()=>{
      Discussion.find({},async (err,discussions)=>{
        discussions.forEach(async (discussion)=>{
          if(discussion.socketids.indexOf(socket.id)!==-1){
            const pos = discussion.socketids.indexOf(socket.id);
            discussion.socketids.splice(pos,1);
            await discussion.save();

          }  
        });
      });
      console.log("Disconnected");
    });
    
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected",userId);

        socket.on('message',message=>{
    
            Discussion.findOne({roomId:message.room},async (err,discussion)=>{
              let y= discussion.students.findIndex(x=>x.email === message.msg);
              if(discussion.email === message.user){
                io.to(roomId).emit('createMessage',{
                  user:discussion.admin,
                  msg:message.msg
                });
              }else if(y===-1){
                Student.findOne({email:message.user},(err,stud)=>{
                  io.to(roomId).emit('createMessage',{
                    user:stud.name,
                    msg:message.msg
                  });
                });
              }else{
                discussion.students[y].present=true;
                await discussion.save();
                Student.findOne({email:message.user},(err,stud)=>{
                  io.to(roomId).emit('createMessage',{
                    user:stud.name,
                    msg:message.msg
                  });
                });
              }
            });
        });
    });  
});


var ExpressPeerServer = require('peer').ExpressPeerServer;
var peerExpress = require('express');
var peerApp = peerExpress();
var peerServer = require('http').Server(peerApp);
var options = { debug: true }
var peerPort = 443;

peerApp.use('/peerjs', ExpressPeerServer(peerServer, options));

 



server.listen(PORT,()=>{
    console.log("Server Started ");
});
// peerServer.listen(peerPort)
 