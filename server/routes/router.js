// routes/router.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');


module.exports = router;


router.post('/register', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
      `select * from User where lower(username) = lower('${db.escape(req.body.username)}');`,
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: 'This username is already in use!'
          });
        } else {
          // username is available
          bcrypt.hash(req.body.txtPassword, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err
              });
            } else {
              // has hashed pw => add to database
              db.query(
                `insert into User(idUser, txtEmail, txtUsername, txtPassword) values ('${uuid.v4()}', ${db.escape(req.body.txtEmail)}, ${db.escape(req.body.txtUsername)}, ${db.escape(hash)})`,
                (err, result) => {
                  if (err) {
                    //throw err;
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  return res.status(201).send({
                    msg: 'Registered!'
                  });
                }
              );
            }
          });
        }
      }
    );
  });

  router.post('/login', (req, res, next) => {
    db.query(
      `select * from User where txtUsername = ${db.escape(req.body.txtUsername)};`,
      (err, result) => {
        // user does not exists
        if (err) {
          throw err;
          return res.status(400).send({
            msg: err
          });
        }
        if (!result.length) {
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
        // check password
        bcrypt.compare(
          req.body.password,
          result[0]['password'],
          (bErr, bResult) => {
            // wrong password
            if (bErr) {
              //throw bErr;
              return res.status(401).send({
                msg: 'Username or password is incorrect!'
              });
            }
            if (bResult) {
              const token = jwt.sign({
                  username: result[0].username,
                  userId: result[0].id
                },
                'SECRETKEY', {
                  expiresIn: '7d'
                }
              );
              /*
              db.query(
                `update User set last_login = now() WHERE id = '${result[0].id}'`
              );
              return res.status(200).send({
                msg: 'Logged in!',
                token,
                user: result[0]
              });
              */
            }
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }
        );
      }
    );
  });


  router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
  });