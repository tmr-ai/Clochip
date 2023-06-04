// lib/db.js
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'eeb',
  database: 'eeb',
  password: 'PASSWORD'
});
connection.connect();
module.exports = connection;