const express = require('express');
const router = express.Router();
const Student = require('../db/Models/studentModel');
const Teacher = require('../db/Models/teacherModel');






// router.get('/dashboard', async (req, res) => {
//   const { userType, id } = req.cookies;
//   console.log(userType);
//   try {
//     let dashboardData = {};

//     if (userType === 'student') {
//       // Fetch student data using the ID
//       const studentData = await Student.findById(id);
//       if (studentData) {
//         dashboardData = {
//           userType,
//           studentData
//         };
//       }
//     } else if (userType === 'teacher') {
//       // Fetch teacher data using the ID
//       const teacherData = await Teacher.findById(id);
//       if (teacherData) {
//         dashboardData = {
//           userType,
//           teacherData
//         };
//       }
//     }
//     console.log(dashboardData);
    

    
//     // res.json(dashboardData);
//     res.json({
//       "userType": "teacher",
//       "teacherData": {
//         "name": "Jane Smith",
//         "employeeId": "TCH789",
//         "subject": "Computer Science",
//         "teachingExperience": "5 years",
//         "classes": ["Class 9A", "Class 10B"],
//         "studentsTaught": ["John Doe", "Alice Johnson"]
//         // Add more teacher-specific data here
//       }
//     }
    
//     );
//   } catch (error) {
//     console.error('Error fetching dashboard data:', error);
//     res.status(500).json({ error: 'An error occurred while fetching dashboard data' });
//   }
// });

module.exports = router;
