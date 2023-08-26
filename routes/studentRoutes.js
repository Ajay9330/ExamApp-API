const express = require('express');
const router = express.Router();
const Student = require('../db/Models/studentModel');

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


module.exports = router;
