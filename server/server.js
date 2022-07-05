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
const router = require('./routes/router');
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
module.exports = db;


//app.listen(port, () => console.log(`Server running on port ${port}`));
https.createServer(options, app).listen(3000);

app.get('/item', (req, res, next) => {
  let query = 'select * from Item;'
  basicQuery(query, req, res)
})

app.get('/item/single', (req, res, next) => {
  let query = 'select * from Item where idItem '+mysql.escape(req.query.idItem)+';'
  basicQuery(query, req, res)
})

app.get('/itemByUser', (req, res, next) => {
  let query = 'select * from Item left join ItemWashingInfo on Item.idItem = ItemWashingInfo.fidItem where blnActive = true and fidUser = '+mysql.escape(req.query.fidUser)+';'
  basicQuery(query, req, res)
})

app.get('/itemByUser/withImage', (req, res, next) => {
  let query = 'select * from Item left join ItemWashingInfo on Item.idItem = ItemWashingInfo.fidItem left join ItemImage on Item.idItem = ItemImage.fidItem where blnActive = true and fidUser = '+mysql.escape(req.query.fidUser)+';'
  basicQuery(query, req, res)
})

app.get('/favoritesByUser', (req, res, next) => {
  let query = 'select * from Item where fidUser = '+mysql.escape(req.query.fidUser)+' and blnActive = true and blnFavorite = true;'
  basicQuery(query, req, res)
})

app.get('/favoritesByUser/withImage', (req, res, next) => {
  let query = 'select * from Item left join ItemWashingInfo on Item.idItem = ItemWashingInfo.fidItem left join ItemImage on Item.idItem = ItemImage.fidItem where blnActive = true and fidUser = '+mysql.escape(req.query.fidUser)+' and blnFavorite = true;'
  basicQuery(query, req, res)
})

app.get('/dirtyByUser', (req, res, next) => {
  let query = 'select * from Item left join ItemWashingInfo on Item.idItem = ItemWashingInfo.fidItem where fidUser = '+mysql.escape(req.query.fidUser)+' and blnActive = true and blnDirty = true;'
  basicQuery(query, req, res)
})

app.post('/markAsDirty', (req, res, next) => {
  let query = 'update Item set blnDirty = true where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

app.post('/unmarkAsDirty', (req, res, next) => {
  let query = 'update Item set blnDirty = false where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

app.post('/markAsFavorite', (req, res, next) => {
  let query = 'update Item set blnFavorite = true where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

app.post('/unmarkAsFavorite', (req, res, next) => {
  let query = 'update Item set blnFavorite = false where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

app.post('/remove', (req, res, next) => {
  let query = 'update Item set blnActive = false where idItem = '+mysql.escape(req.body.idItem)+';'
  basicQuery(query, req, res)
})

app.post('/insertItem', (req, res, next) => {
  console.log(req.body)
  let query = 'insert into Item(idItem, fidUser, tsCreated, tsChanged, tsLastRead, txtName, txtDescription, txtSize, enumCut, setColor, setMaterial, setType, enumCondition, enumWeather, blnDirty, blnFavorite) values ('+              
              mysql.escape(req.body.idItem)+', '+
              mysql.escape(req.body.fidUser)+', '+
              mysql.escape(req.body.tsCreated)+', '+
              mysql.escape(req.body.tsChanged)+', '+
              mysql.escape(req.body.tsLastRead)+', '+
              mysql.escape(req.body.txtName)+', '+
              mysql.escape(req.body.txtDescription)+', '+
              mysql.escape(req.body.txtSize)+', '+
              mysql.escape(req.body.enumCut)+', '+
              mysql.escape(req.body.txtSetColor)+', '+
              mysql.escape(req.body.txtSetMaterial)+', '+
              mysql.escape(req.body.txtSetType)+', '+
              mysql.escape(req.body.enumCondition)+', '+
              mysql.escape(req.body.enumWeather)+', '+
              mysql.escape(req.body.blnDirty)+', '+
              mysql.escape(req.body.blnFavorite)+' '+
              ');'

    db.query(query, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        let queryImage = 'insert into ItemImage(fidItem, blobImage) values ('+mysql.escape(req.body.idItem)+', '+mysql.escape(req.body.blobImage)+');'
        db.query(queryImage, (err, result) => {
          if(err) {
            console.log(err)
          }
        })

        let queryWashingInfo = 'insert into ItemWashingInfo(fidItem, nmbTemperature, nmbSpinningCycles) values ('+
          mysql.escape(req.body.idItem)+', '+
          mysql.escape(req.body.nmbTemperature)+', '+
          mysql.escape(req.body.nmbSpinningCycles)+' '+
          ');'

          db.query(queryWashingInfo, (err, result) => {
            if(err) {
              console.log(err)
            }
          })
      }
  })
})

app.post('/updateItem', (req, res, next) => {
    let query = 'update Item set '+
      'txtName = '+mysql.escape(req.body.txtName)+', '+
      'txtDescription = '+mysql.escape(req.body.txtName)+', '+
      'txtSize = '+mysql.escape(req.body.txtName)+', '+
      'enumCut = '+mysql.escape(req.body.txtName)+', '+
      'setColor = '+mysql.escape(req.body.txtName)+', '+
      'setMaterial = '+mysql.escape(req.body.txtName)+', '+
      'setType = '+mysql.escape(req.body.txtName)+', '+
      'enumCondition = '+mysql.escape(req.body.txtName)+', '+
      'enumWeather = '+mysql.escape(req.body.txtName)+' '+
      'where idItem = '+mysql.escape(req.body.idItem)+';'

    db.query(query, (err, result) => {
      if(err) {
        console.log(err)
      } 
    })

    let queryWashing = 'update ItemWashingInfo set '+
      'nmbTemperature = '+mysql.escape(req.body.nmbTemperature)+', '+
      'nmbSpinningCycles = '+mysql.escape(req.body.nmbSpinningCycles)+' '+
      'where fidItem = '+mysql.escape(req.body.idItem)+';'

    db.query(queryWashing, (err, result) => {
      if(err) {
        console.log(err)
      } 
    })
})

function basicQuery(query, req, res) {
  db.query(query, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(400).send({
          msg: err
        });
      } else {
          res.send(result)
      }
  })
}


