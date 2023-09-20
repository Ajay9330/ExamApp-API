const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    default: "teacher" // Default value for userType
  },
  mainsubject:String,
  name:String,
  gender:String,
  joinedAt:Date,
  token: String,
  experience: String,
  subjects: String,
  degrees: String,
  age:Number,
  examsCreated: [
    {
      name: String,
      date: Date,
      score: Number
    }
  ],  imageUrl:String,
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
