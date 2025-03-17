const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  applicationForm: [{ label: String, type: String }],
  contentAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" ,required:true}], // New field
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
