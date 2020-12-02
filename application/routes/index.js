var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "imagetree", css: ['landing.css']});
});

router.get('/home', function(req, res, next) {
  res.render('home', {title: "Home | imagetree", css: ['home.css'], js: ['home.js']});
});

router.get('/login', (req, res, next) => {
  res.render('login', {title: "Login | imagetree", css: ['login.css', 'formui.css'], hideFooter: true});
});

router.get('/signup', function(req, res, next) {
  res.render('registration', {title: "Sign Up | imagetree", css: ['registration.css', 'formui.css'], js: ['registrationValidation.js'], hideFooter: true});
});

router.get('/tos', function(req, res, next) {
  res.render('tos', {title: "Terms of Service | imagetree"});
});

router.get('/privacy', function(req, res, next) {
  res.render('privacy', {title: "Privacy Policy | imagetree"});
});

router.get('/post', function(req, res, next) {
  res.render('postimage', {title: "Post | imagetree", css: ['formui.css'], js: ['postimage.js'], hideFooter: true});
});


module.exports = router;
