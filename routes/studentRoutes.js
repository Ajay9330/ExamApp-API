const express = require('express');
const router = express.Router();
const Student = require('../db/Models/studentModel');
const CreateExam=require('../db/Models/CreateExam');
const ExamResult=require('../db/Models/ExamResult');



//functions
// Define a middleware function to check if the student has already submitted the exam
const checkExamSubmission = async (req, res, next) => {
  const examId = req.params.examId || req.body.examId; // Allow for both URL parameter and request body
  const stId = req.cookies.id;

  try {
    const issubmitted = await ExamResult.find({ studentId: stId, examId: examId });
    if (issubmitted.length > 0) {
      // Student has already submitted an exam
      const submittedAt = issubmitted[0].submittedAt;
      return res.status(400).json({ error: `Already submitted Exam on ${submittedAt}` });
    }
    // Continue with your code to handle the case where the student hasn't submitted the exam yet
    next();
  } catch (error) {
    console.error('Error checking if student has submitted an exam:', error);
    res.status(500).json({ error: 'An error occurred while checking the submission status' });
  }
};





router.use('/',(req,res,next)=>{console.log("student route");next()})

// Student-specific routes
router.get('/profile', async (req, res) => {
  const studentId = req.cookies.id;
  console.log("getting student profile");
  try {
    const studentData = await Student.findById(studentId);
    if (!studentData) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    console.log(studentData);
    res.json({ studentData });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: 'An error occurred while fetching student profile' });
  }
});


router.get('/exams', async (req, res) => {
  console.log('Getting exams');
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set date to the next day
    tomorrow.setHours(0, 0, 0, 0); // Set time to the beginning of the next day

    const [todayExams, upcomingExams, pastExams] = await Promise.all([
      CreateExam.find({ date: { $gte: today, $lt: tomorrow } }).sort({ date: 1 }).exec(),
      CreateExam.find({ date: { $gt: tomorrow } }).sort({ date: 1 }).exec(),
      CreateExam.find({ date: { $lt: today } }).sort({ date: -1 }).limit(10).exec()
    ]);

    const examsObject = {
      today: todayExams,
      upcoming: upcomingExams,
      past: pastExams
    };

    res.status(200).json(examsObject);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'An error occurred while fetching exams' });
  }
});


router.get('/exam/:examId', checkExamSubmission,async (req, res) => {
  try {
    const examId = req.params.examId;
    const stId=req.cookies.id;
    
    console.log(examId);

    const exam = await CreateExam.findById(examId).exec();

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'An error occurred while fetching the exam' });
  }
});





router.post('/exam/submit-exam', checkExamSubmission,async (req, res) => {
  try {
    console.log("submitting-exam");
    const { examId, studentAnswers, examCode } = req.body;

    // Find the exam by ID
    const exam = await CreateExam.findById(examId).exec();
    const student=await Student.findById(req.cookies.id).exec();
    

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Calculate the student's score based on their answers
    let score = 0;
    const updatedStudentAnswers = studentAnswers.map((studentAnswer) => {
      const question = exam.questions.find((q) => q._id.toString() === studentAnswer.questionId);
      if (question) {
        const isCorrect = question.selectedOptionIndex === studentAnswer.selectedOptionIndex;
        // Create a new object with additional properties
        return {
          ...studentAnswer,
          questiontext:question.text,
          options:question.options,
          isCorrect,
          correctOptionIndex: question.selectedOptionIndex,
        };
      }
      return studentAnswer;
    });

    // Calculate the score based on correct answers
    score = updatedStudentAnswers.filter((answer) => answer.isCorrect).length;

    console.log('Updated Student Answers:', updatedStudentAnswers); // Debugging

    // Create a new exam result document and save it to MongoDB
    const examResult = new ExamResult({
      examCode,
      examId: exam._id,
      examTitle:exam.title,
      examStartAt:exam.date,
      studentId: req.cookies.id, // Assuming you have user authentication in place
      score,
      answers: updatedStudentAnswers,
      studentClass:student.class,
      studentSeat:student.seatNo,
      studentName:student.name
    });

    await examResult.save();

    res.status(200).json({ score });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ error: 'An error occurred while submitting the exam' });
  }
});

module.exports = router;


