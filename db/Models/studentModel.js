const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },  userType: {
    type: String,
    default: "student" // Default value for userType
  },
  name:String,
  gender:String,
  class:String,
  token: String,
  studentId: String,
  class: String,
  seatNo: String,
  addedBy: String,
  joinedDate: Date,
  prnNo: String,
  age:Number,
  exams: [
    {
      name: String,
      date: Date,
      score: Number
    }
  ]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
