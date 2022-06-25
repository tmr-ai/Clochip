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
  let query = 'select * from Item;'
  basicQuery(query, req, res)
})

router.get('/itemByUser', (req, res, next) => {
  let query = 'select * from Item where fidUser = '+mysql.escape(req.query.fidUser)+';'
  basicQuery(query, req, res)
})

router.get('/favoritesByUser', (req, res, next) => {
  let query = 'select * from Item where fidUser = '+mysql.escape(req.query.fidUser)+' and blnFavorite = true;'
  basicQuery(query, req, res)
})

router.post('/markAsDirty', (req, res, next) => {
  let query = 'update Item set blnDirty = true where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

router.post('/unmarkAsClean', (req, res, next) => {
  let query = 'update Item set blnDirty = false where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

router.post('/markAsFavorite', (req, res, next) => {
  let query = 'update Item set blnFavorite = true where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

router.post('/unmarkAsFavorite', (req, res, next) => {
  let query = 'update Item set blnFavorite = false where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

router.post('/insertItem', (req, res, next) => {
  let query = 'insert into Item(idItem, fidUser, tsCreated, tsChanged, tsLastRead, txtName, txtDescription, txtSize, enumCut, setColor, setMaterial, setType, enumCondition, blnDirty, blnFavorite) values ('+
              uuid()+', '+
              mysql.escape(req.body.fidUser)+', '+
              mysql.escape(req.body.tsCreated)+', '+
              mysql.escape(req.body.tsChanged)+', '+
              mysql.escape(req.body.tsLastRead)+', '+
              mysql.escape(req.body.txtName)+', '+
              mysql.escape(req.body.txtDescription)+', '+
              mysql.escape(req.body.txtSize)+', '+
              mysql.escape(req.body.enumCut)+', '+
              mysql.escape(req.body.setColor)+', '+
              mysql.escape(req.body.setMaterial)+', '+
              mysql.escape(req.body.setType)+', '+
              mysql.escape(req.body.enumCondition)+', '+
              mysql.escape(req.body.blnDirty)+', '+
              mysql.escape(req.body.blnFavorite)+' '+
              ');'

    db.query(query, (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      } else {
        let id = 0;
        for (var prop in results[0]) {
            id = results[0][prop]
            break;
        }

        let queryImage = 'insert into ItemImage(fidItem, blobImage) values ('+mysql.escape(id)+', '+mysql.escape(req.body.blobImage)+');'
        db.query(query, (err, result) => {
          if(err) {
            return res.status(400).send({
              msg:err
            })
          }
        })

        let queryWashingInfo = 'insert into ItemWashingInfo(fidItem, nmbTemperature, nmbSpinningCycles) values ('+
          mysql.escape(id)+', '+
          mysql.escape(req.body.nmbTemperature)+', '+
          mysql.escape(req.body.nmbSpinningCycles)+' '+
          ');'

          db.query(query, (err, result) => {
            if(err) {
              return res.status(400).send({
                msg:err
              })
            }
          })
      }
  })
})

basicQuery(query, req, res) {
  db.query(query, (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      } else {
          res.send(result)
      }
  })
}
