const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: String,
  options: [String],
  selectedOptionIndex: Number,
});

const examSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
  title: String,
  date: Date, // Date of the exam
  duration: Number, // Duration of the exam in minutes
  createdBy: String,
  examCode: String,
  questions: [questionSchema], // Array of question objects
});

const CreateExam = mongoose.model('Exam', examSchema);

module.exports = CreateExam;
