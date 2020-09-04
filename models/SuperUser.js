const mongoose = require("mongoose");

const SuperUserSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true
    },
    accessToken: [String]
});
module.exports = mongoose.model("superuser", SuperUserSchema);
