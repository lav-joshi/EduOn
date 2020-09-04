const http= require("http");
const express = require("express");
const path=require("path");
const socketio = require("socket.io");
const keys = require("./config/keys");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
require("./db/mongoose");
const student = require("./routes/api/student");
const teacher = require("./routes/api/teacher");
const superuser = require("./routes/api/superuser");
const authRoutes = require("./routes/api/auth");
const passport = require("passport");
const cron = require("node-cron");
const Discussion = require("./models/Discussion")
const app=express();
const PORT = process.env.PORT || 3000;

const server=http.createServer(app)
const io = socketio(server);

app.use(express.json());
app.set("view engine", "ejs");
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
    res.render("home",{currentUser:req.user,clientType:req.session.client});
});


app.use("/student", student);
app.use("/teacher", teacher);
app.use("/superuser", superuser);
app.use("/auth", authRoutes);

io.on('connection',(socket)=>{
    console.log("New Web Socket Connection");
    
    socket.on('join',({useremail,room},callback)=>{
      console.log("uuu");
      socket.join(room);   
      Discussion.findOne({roomId:room},async (err,discussion)=>{
        discussion.socketids.push(socket.id);
        await discussion.save();  
      });
    });

    socket.on('sendMessage',(msg,callback)=>{
      msg.createdAt=new Date().getTime();
      console.log(msg);

        Discussion.findOne({roomId:msg.roomId},async (err,discussion)=>{
          discussion.texts.push(msg);
          await discussion.save();

          discussion.socketids.forEach((id)=>{
            io.to(id).emit('message',msg);
          });
        })
      callback();
    });

    socket.on('disconnect',()=>{
      Discussion.find({},async (err,discussions)=>{
        discussions.forEach(async (discussion)=>{
          if(discussion.socketids.indexOf(socket.id)!==-1){
            const pos = discussion.socketids.indexOf(socket.id);
            discussion.socketids.splice(pos,1);
            await discussion.save();
            console.log("dd");
          }
        });
      });
      console.log("Disconnected");
    });

});

server.listen(PORT,()=>{
    console.log("Server Started ");
});