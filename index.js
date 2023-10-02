const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const d = require('dotenv');
d.config({ path: './config.env' });
require('./db/conn');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();
console.log(`${process.env.DMN}`)

const corsOptions = {
  origin:['https://examapp-qp94.onrender.com','http://localhost:3000'],
  methods: ['GET', 'POST','DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));



// enable cors
// app.use(
//   cors({
//     origin: true,
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );
// app.options(
//   '*',
//   cors({
//     origin: true,
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );
app.use(bodyparser.json({ limit: '10mb' }));
const auth = require('./Auth/authenticate');
app.use(cookieParser());
// app.use(express.json());

const md = auth.middleware;

// Placeholder function to simulate generating an authentication token
app.post('/login', auth.login);

app.use(md);
app.post('/logout', auth.logout);

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

app.use((req, res) => {
  res.status(404).send("Page not found");
});

const port = process.env.PORT || 3300;
app.listen(port, () => {
  console.log("Listening on port", port);
});
