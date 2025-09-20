const sqlite3 = require('sqlite3').verbose();

// Use absolute path in production for safety
const path = require('path');
const dbPath = path.join(__dirname, '../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully:', dbPath);
  }
});

module.exports = db;

