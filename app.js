const express = require("express");
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

const app=express();
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

const PORT = process.env.PORT || 3000;

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


app.listen(PORT,()=>{
    console.log("Server Started ");
})