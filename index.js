const express = require('express');
const cors = require('cors'); // Import cors module and use it as a function
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const d = require('dotenv');
d.config({ path: './config.env' });
require('./db/conn');

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());

const auth = require('./Auth/authenticate');
const md = auth.middleware;

// Placeholder function to simulate generating an authentication token
function generateAuthToken(email) {
  const secretKey = 'key';
  const expiresIn = '30s';
  const token = jwt.sign({ email }, secretKey, { expiresIn });
  return token;
}

app.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;
  console.log(email + password + userType);
  console.log("post request");

  try {
    const token = generateAuthToken(email + 1000 * Math.random());

    const [isValid, id] = await auth.isValidUser(email, password, userType, token);
    console.log(id);
    if (isValid) {
      res.cookie('token', token, { httpOnly: false });
      res.cookie('userType', userType);
      res.cookie('email', email);
      res.cookie('id', id);
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(md);

app.get('/', (req, res) => {
  console.log("root");
  res.send("Hello from the root route!");
});

const port = process.env.PORT || 3300;
app.listen(port, () => {
  console.log("Listening on port", port);
});
