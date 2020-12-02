const express = require('express');
var router = express.Router();

const db = require('../config/database');


router.get('/getAllUsers', (req, res, next) => {
    db.query('SELECT * from users;', (err, results, fields) => {
        console.log(results);
        res.send(results);
    })
    res.send('getting all posts');
});
module.exports = router;