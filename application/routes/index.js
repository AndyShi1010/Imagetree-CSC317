var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {css: ['landing.css']});
});

router.get('/home', function(req, res, next) {
  res.render('home');
});

router.get('/login', (req, res, next) => {
  res.render('login', {css: ['login.css', 'formui.css']});
});

router.get('/register', function(req, res, next) {
  res.render('registration', {css: ['registration.css']});
});

router.get('/tos', function(req, res, next) {
  res.render('tos');
});


module.exports = router;
