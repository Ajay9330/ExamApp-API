const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: String,
  experience: String, // Add teacher-specific fields
  subjects: String,
  degrees: String
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;