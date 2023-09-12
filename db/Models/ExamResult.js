const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  examId:{type:mongoose.Schema.Types.ObjectId,ref:'Exam',required:true},
  examCode: { type: String, required: true },
  examTitle:String, 
  examStartAt:Date,
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  answers: [{}],
  score: { type: Number }, 
  submittedAt: { type: Date, default: Date.now }, 
  studentName:String,
  studentSeat:String,
  studentClass:String,
  

});

const ExamResult = mongoose.model('ExamResult', examResultSchema);

module.exports = ExamResult;
