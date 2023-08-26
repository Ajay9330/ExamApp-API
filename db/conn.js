const db = process.env.db;
const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  } catch (err) {
    
    console.error('Error connecting to the database:', err);
  }
}

console.log('Connection is called');
connectToDatabase();
