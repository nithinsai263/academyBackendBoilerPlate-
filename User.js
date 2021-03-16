const mongoose = require("mongoose");
let userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
  },
  { collection: "authorization" }
);

var Users = mongoose.model("User", userSchema);
module.exports = { Users };
