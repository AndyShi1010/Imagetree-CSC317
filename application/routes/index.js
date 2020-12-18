var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var notLoggedIn = require('../middleware/routeprotectors').userNotLoggedIn;
var getRecentPosts = require('../middleware/postgrabber').getRecentPosts;
var db = require('../config/database');
var PostModel = require('../models/Posts');

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

// router.use('/post', isLoggedIn);
router.get('/post', isLoggedIn, function(req, res, next) {
  res.render('postimage', {title: "Post | imagetree", css: ['formui.css', 'postimage.css'], js: ['postimage.js'], hideFooter: true});
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
      res.render('imagepost', {currentPost: post, timeString, title: `${post.title} by ${post.username} | imagetree`, css: ['imagepost.css']})
    } else {
      req.flash('error', 'Post could not be found.');
      res.redirect("/home");
    }
  })
})

router.get('/search', (req, res, next) => {
  let searchQuery = req.query.q;
  if(!searchQuery) {
      res.send({
          resultsStatus: "info",
          message: "No search term was given",
          results: []
      });
  } else {
    PostModel.search(searchQuery)
    .then((results) => {
      // if(results.length) {
        if (results) {
          res.locals.results = results;
        }
        res.render('home', {isSearch: true, query: searchQuery, title: `Search for ${searchQuery} | imagetree`, css: ['home.css'], js: ['home.js']});
      // }
    })
      // let baseSQL = "SELECT id, title, description, thumbpath, concat_ws(' ', title, description) AS haystack FROM posts HAVING haystack like ? LIMIT 20;"
      // let sqlSearchQuery = "%" + searchQuery + "%";
      // db.execute(baseSQL, [sqlSearchQuery])
      // .then(([results, fields]) => {
      //     res.locals.results = results;
      //     res.render('home', {isSearch: true, query: searchQuery, title: `Search for ${searchQuery} | imagetree`, css: ['home.css'], js: ['home.js']});
      // })
      // .catch((err) => next(err))
  }
});

router.get('/myposts', isLoggedIn, (req, res, next) => { 
  console.log("Params: " + req.session.userId);
  
  let baseSQL = "SELECT u.username, p.id, p.title, p.description, p.thumbpath, p.created FROM users u JOIN posts p ON u.id=fk_userid WHERE u.id=?;"
  db.execute(baseSQL, [req.session.userId])
      .then(([results, fields]) => {
        res.locals.results = results;
        res.render('home', {heading: "My Posts", subheading: `You have ${results.length} post(s)`, title: `${req.session.username}'s Posts | imagetree`, css: ['home.css'], js: ['home.js']});
      })
      .catch((err) => next(err))
});


module.exports = router;
