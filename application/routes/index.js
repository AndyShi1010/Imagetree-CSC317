var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {css: ['landing.css']});
});

router.get('/home', function(req, res, next) {
  res.render('home', {css: ['home.css'], js: ['home.js']});
});

router.get('/login', (req, res, next) => {
  res.render('login', {css: ['login.css', 'formui.css'], hideFooter: true});
});

router.get('/signup', function(req, res, next) {
  res.render('registration', {css: ['registration.css', 'formui.css'], js: ['registrationValidation.js'], hideFooter: true});
});

router.get('/tos', function(req, res, next) {
  res.render('tos');
});

router.get('/privacy', function(req, res, next) {
  res.render('privacy');
});

router.get('/post', function(req, res, next) {
  res.render('postimage', {css: ['formui.css'], js: ['postimage.js'], hideFooter: true});
});


module.exports = router;
