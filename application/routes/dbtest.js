const express = require('express');
const router = express.Router();

const db = require('../config/database');


router.get('/getAllUsers', (req, res, next) => {
    db.query('SELECT * from users;', (err, results, fields) => {
        if(err) {
            next(err);
        }
        console.log(results);
        res.send(results);
    })
    // res.send('getting all posts');
});

router.get('/getAllPosts', (req, res, next) => {
    db.query('SELECT * from posts;')
    .then(([results, fields]) => {
        console.log(results);
        res.send(results);
    })
    .catch((err) => {
        next(err);
    });
    // res.send('getting all posts');
});

router.post('/createUser', (req, res, next) => {
    console.log(req.body);
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    let baseSQL = 'INSERT INTO users (username, email, password, created) VALUES (?, ?, ?, now())';
    db.query(baseSQL, [username, email, password])
    .then(([results, fields]) => {
        if (results && results.afffectedRows) {
            res.send('User was made');
        } else {
            res.send('User was not made');
        }
    })
})
module.exports = router;