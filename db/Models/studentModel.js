const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: String,
  studentId: String, // Add student-specific fields
  class: String,
  seatNo: String,
  addedBy: String,
  joinedDate: Date,
  prnNo: String
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;