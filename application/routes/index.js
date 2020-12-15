var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var notLoggedIn = require('../middleware/routeprotectors').userNotLoggedIn;
var getRecentPosts = require('../middleware/postgrabber').getRecentPosts;
var db = require('../config/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "imagetree", css: ['landing.css']});
});

router.get('/home', getRecentPosts, function(req, res, next) {
  res.render('home', {title: "Home | imagetree", css: ['home.css'], js: ['home.js']});
});

router.get('/login', notLoggedIn, (req, res, next) => {
  res.render('login', {title: "Login | imagetree", css: ['login.css', 'formui.css'], hideFooter: true, minFlash: true});
});

router.get('/signup', notLoggedIn, function(req, res, next) {
  res.render('registration', {title: "Sign Up | imagetree", css: ['registration.css', 'formui.css'], js: ['registrationValidation.js'], hideFooter: true, minFlash: true});
});

router.get('/tos', function(req, res, next) {
  res.render('tos', {title: "Terms of Service | imagetree"});
});

router.get('/privacy', function(req, res, next) {
  res.render('privacy', {title: "Privacy Policy | imagetree"});
});

router.get('/imagepost', function(req, res, next) {
  res.render('imagepost', {title: "Post | imagetree", css: ['imagepost.css']});
});

// router.use('/post', isLoggedIn);
router.get('/post', isLoggedIn, function(req, res, next) {
  res.render('postimage', {title: "Post | imagetree", css: ['formui.css'], js: ['postimage.js'], hideFooter: true});
});

router.get('/posts/:id(\\d+)', (req, res, next) => {
  let baseSQL = "SELECT u.username, p.title, p.description, p.photopath, p.created FROM users u JOIN posts p ON u.id=fk_userid WHERE p.id=?;";
  let postId = req.params.id;

  db.execute(baseSQL, [postId])
  .then(([results, fields]) => {
    if (results && results.length) {
      let post = results[0]
      let timeNew = new Date(results[0].created);
      let timeString = timeNew.toLocaleDateString("en-US") + " at " + timeNew.toLocaleTimeString("en-US");
      console.log(timeString);
      res.render('imagepost', {currentPost: post, timeString, title: `${post.title} | imagetree`, css: ['imagepost.css']})
    } else {
      req.flash('error', 'Post could not be found.')
      res.redirect("/home");
    }
  })
})


module.exports = router;
