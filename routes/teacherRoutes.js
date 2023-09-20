const express = require('express');
const router = express.Router();
const Teacher = require('../db/Models/teacherModel');
const Student=require("../db/Models/studentModel");
const CreateExam=require('../db/Models/CreateExam');
const ExamResult=require('../db/Models/ExamResult');
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
  const { userType, email, password, ...otherFields } = req.body.userDetails; // Spread other fields
    imageUrl=req.body.imageUrl;
    // console.log( req.body.imageUrl);
  try {
    let userModel;

    if (userType === 'teacher') {
      userModel = Teacher;
    } else if (userType === 'student') {
      userModel = Student;
    } else {
      return res.status(400).json({ error: 'Invalid user type', });
    }

    // Check if a user with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create and save the new user
    const newUser = new userModel({ email, password, ...otherFields,imageUrl }); // Spread other fields
    await newUser.save();

    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'An error occurred while adding user' });
  }
});


router.get('/search-user', async (req, res) => {
  const searchQuery = req.query.q;

  console.log(req.query);

  try {
    // Search for users in both Teacher and Student models

    const teacherResults = await Teacher.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
      ],
    });
    // console.log(teacherResults);

    const studentResults = await Student.find({
      $or: [
        { name: { $regex: searchQuery } },
        { email: { $regex: searchQuery } },
      ],
    });
    // console.log(studentResults);

    const results = [...teacherResults, ...studentResults]; // Combine the results
    console.log(results);
    res.status(200).json({ results });
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ error: 'An error occurred while searching for users' });
  }
});



router.delete('/delete-user/:id/:usertype', async (req, res) => {
  const userType = req.params.usertype;
  const userId = req.params.id;

  try {
    let model;
    if (userType === 'teacher') {
      model = Teacher;
    } else if (userType === 'student') {
      model = Student;
    } else {
      return res.status(400).send('Invalid user type');
    }

    const isDeleted = await model.findByIdAndDelete(userId);

    if (isDeleted) {
      res.status(200).send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
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
      const exams = await CreateExam.find().sort({ createdAt: -1 }).exec();
      
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
  


  router.get('/exam-results/:examId', async (req, res) => {
    console.log("exam-result");
    const { examId } = req.params;
  
    try {
      // Use your ExamResult model to find exam results by examId
      const examResults = await ExamResult.find({ examId });
  
      if (!examResults) {
        return res.status(404).json({ error: 'Exam results not found' });
      }
      console.log(examResults);
  
      // Return the exam results as JSON
      res.status(200).json(examResults);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      res.status(500).json({ error: 'An error occurred while fetching exam results' });
    }
  });
  





module.exports = router;
