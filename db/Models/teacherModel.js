const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  email: String,
  password: String,
  token:String
  // Other teacher-specific fields
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
