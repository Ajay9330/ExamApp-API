const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const d = require('dotenv');
d.config({ path: './config.env' });
require('./db/conn');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();
app.use(cors({ credentials: true, origin: ['http://localhost:3000', '*'] }));
app.use(cookieParser());
app.use(express.json());

const auth = require('./Auth/authenticate');
const md = auth.middleware;

// Placeholder function to simulate generating an authentication token
app.post('/login', auth.login);

app.use(md);
app.post('/logout', auth.logout);

// Define dashboard routes based on user type using router.use
app.use('/', (req, res, next) => {
  const userType = req.cookies.userType;
  console.log('main route');
  if (userType === 'student') {
    studentRoutes(req, res, next);
  } else if (userType === 'teacher') {
    teacherRoutes(req, res, next);
  } else {
    console.log('main route2');
    res.status(401).json({ error: 'Unauthorized route' });
  }
});

app.get('/verify', (req, res) => {
  console.log("root");
  res.status(200).send("Hello from the root route!");
});

// app.use('/', router);
app.use((req, res) => {
  res.status(404).send("Page not found");
});

const port = process.env.PORT || 3300;
app.listen(port, () => {
  console.log("Listening on port", port);
});
