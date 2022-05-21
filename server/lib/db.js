// lib/db.js
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'eeb',
  database: 'eeb',
  password: 'eeb2022!'
});
connection.connect();
module.exports = connection;