const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const https = require("https");
fs = require("fs");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/gabler.tech/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/gabler.tech/fullchain.pem"),
};

const hostname = 'gabler.tech';
const port = 3000;

app.use(helmet());
app.use(bodyParser.urlencoded({     
  extended: true
})); 
app.use(morgan('combined'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(function(req, res, next) {
  
  req.header('Access-Control-Allow-Origin', '*');
  req.header('Access-Control-Allow-Methods', '*');
  req.header('Access-Control-Allow-Headers', '*');

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
 
  next();
});


const db = mysql.createConnection ({
    host: 'localhost',
    user: 'eeb',
    database: 'eeb',
    password: 'eeb2022!',
    multipleStatements: true
})
/**/
db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Connected to database');
});

global.db = db;
db.connect();
module.exports = db;

https.createServer(options, app).listen(3000);


router.get('/item', (req, res, next) => {
    console.log('test')
    db.query(
      `select * from Item;`,
      (err, result) => {
        if (err) {
          return res.status(400).send({
            msg: err
          });
        } else {
            console.log(result)
            res.send(result)
        }
    })
  })
  