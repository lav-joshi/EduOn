const Student = require("../models/Student");

const auth = async (req, res, next) => {
    try {
      if (req.session.token) {
        Student.findOne({ email: req.user.email }, function (err, student) {
          if (student) {
            var x = student.accessToken.indexOf(req.session.token);
            if (x !== -1) {
              next();
            } else {
              res.cookie("token", "");
              res.redirect("/auth/logout");
            }
          } else if (err) {
            res.cookie("token", "");
            res.redirect("/");
          }
        });
      } else {
        res.cookie("token", "");
        res.redirect("/");
      }
    } catch (e) {
      res.redirect("/");
    }
  };

module.exports = auth ;
