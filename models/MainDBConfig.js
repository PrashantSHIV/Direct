const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('../database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});
module.exports = db
