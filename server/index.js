// index.js
const express = require('express');
const app = express();
const cors = require('cors');
// set up port
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
// add routes
const router = require('./routes/router.js');
app.use('/api', router);
// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


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
          return result
        }
    })
  })