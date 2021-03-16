const course = require("./schema");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/academy")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to mongodb", err));

function getallcourses() {
  return course.Courses.find(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      return data;
    }
  });
}

function getDetailsof() {
  return course.Courses.find({}, { projection: { _id: 0, course_id: 1 } });
}

module.exports = { getallcourses, getDetailsof };
