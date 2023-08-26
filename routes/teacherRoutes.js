const express = require('express');
const router = express.Router();
const Teacher = require('../db/Models/teacherModel');
const CreateExam=require('../db/Models/CreateExam');
// Teacher-specific routes
router.get('/profile', async (req, res) => {
  const teacherId = req.cookies.id;
  console.log("getting teacherprofile");
  try {
    const teacherData = await Teacher.findById(teacherId);
    if (!teacherData) {
      res.status(404).json({ error: 'Teacher not found' });
      return;
    }
    console.log(teacherData);
    res.json({ teacherData });
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ error: 'An error occurred while fetching teacher profile' });
  }
});

router.post('/add-user', async (req, res) => {
 
  const { userType, email, password } = req.body;
  console.log('adding user');

  try {
    let userModel;

    if (userType === 'teacher') {
      userModel = Teacher;
    } else if (userType === 'student') {
      userModel = Student;
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // Check if a user with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create and save the new user
    const newUser = new userModel({ email, password, ...req.body }); // Spread other fields
    await newUser.save();

    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'An error occurred while adding user' });
  }
});

   
  router.post('/createxams', async (req, res) => {
    console.log("Creating exam");
    try {
      const { title, date, duration, createdBy, questions,examCode } = req.body;
  
      
      // Validate the input data
      if (!title || !date || !duration || !createdBy || !examCode ) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Create the exam object
      const exam = new CreateExam({
        title,
        date,
        duration,
        createdBy,
        questions,
        examCode,
      });
  
      // Save the exam to the database
      await exam.save();
  
      // Send a success response
      res.status(201).json({ message: 'Exam created successfully', exam });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the exam' });
    }
  });
  
  router.get('/recent-exams', async (req, res) => {
    console.log('getting recent-exams');
    try {
      const exams = await CreateExam.find().sort({ createdAt: -1 }).limit(11); // Change the limit as needed
      
      res.status(200).json({ exams });
    } catch (error) {
      console.error('Error fetching recent exams:', error);
      res.status(500).json({ error: 'An error occurred while fetching recent exams' });
    }
  });
  
  router.delete('/delete-exam/:examId', async (req, res) => {
    const examId = req.params.examId;
  
    try {
      const deletedExam = await CreateExam.findByIdAndDelete(examId);
      if (!deletedExam) {
        res.status(404).json({ error: 'Exam not found' });
        return;
      }
  
      res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
      console.error('Error deleting exam:', error);
      res.status(500).json({ error: 'An error occurred while deleting the exam' });
    }
  });
  


module.exports = router;
