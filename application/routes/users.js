var express = require('express');
var router = express.Router();
var db = require('../config/database');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var UserError = require('../helpers/error/UserError');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmpassword = req.body.confirmpassword;

  // let errorString = "Error: ";
  // let invalid = false;
  // const beginWithAZ = /[A-Za-z]/g;
  // const threePlusAlphaNum = /(.*[A-Za-z0-9]){3}/g;
  // const containUpper = /[A-Z]+/g;
  // const containNum = /\d+/g;
  // const containSpecial = /[/*\-+!@#$^&]+/g

  // if(beginWithAZ.test(username) == false) {
  //   errorString += " Username must start with a letter.";
  //   invalid = true;
  // }

  // if(threePlusAlphaNum.test(username) == false) {
  //   errorString += " Username must contain 3 or more alphanumeric characters.";
  //   invalid = true;
  // }

  // if(containUpper.test(password) == false) {
  //   errorString += " Password must contain an uppercase letter.";
  //   invalid = true;
  // }

  // if(containNum.test(password) == false) {
  //   errorString += " Password must contain a number.";
  //   invalid = true;
  // }

  // if(containSpecial.test(password) == false) {
  //   errorString += " Password must contain one of the following special characters: / * - + ! @ # $ ^ &.";
  //   invalid = true;
  // }

  // if(password.length < 8) {
  //   errorString += " Password must be 8 characters or longer.";
  //   invalid = true;
  // }

  // if (password != confirmpassword) {
  //   errorString += " Passwords do not match.";
  //   invalid = true;
  // }

  // if (invalid) {
  //   console.log("Error thrown");
  //   req.flash('error', errorString);
  //   res.status(500);
  //   res.redirect("/signup");
  //   next(new UserError(errorString, "/signup", 500));
  // }

  db.execute("SELECT * FROM users WHERE username=?", [username])
  .then(([results, fields]) => {
    if(results && results.length == 0) {
      return db.execute("SELECT * FROM users WHERE email=?", [email]);
    } else {
      throw new UserError("Username already exists", "/signup", 200);
    }
  })
  .then(([results, fields]) => {
    if(results && results.length == 0) {
      return bcrypt.hash(password, 12);
    } else {
      throw new UserError("Email already exists", "/signup", 200);
    }
  })
  .then((hashedPassword) => {
      let baseSQL = "INSERT INTO users(`username`,`email`,`password`,`userphoto`,`created`)VALUES(?,?,?,?,now());"
      return db.execute(baseSQL, [username, email, hashedPassword, "/defaultuserphoto.png"]);
  })
  // .then(([results, fields]) => {
  //   if(results && results.length == 0) {
  //     let baseSQL = "INSERT INTO users(`username`,`email`,`password`,`userphoto`,`created`)VALUES(?,?,?,?,now());"
  //     return db.execute(baseSQL, [username, email, password, "/defaultuserphoto.png"]);
  //   } else {
  //     throw new UserError("Registration Failed: Email already exists", "/signup", 200);
  //   }
  // })
  .then(([results, fields]) => {
    if(results && results.affectedRows) {
      successPrint("User.js: User was created");
      req.flash('success', 'Your account is now ready.');
      res.redirect('/login');
    } else {
      throw new UserError("Server Error: User could not be created", "/signup", 500);
    }
  })
  .catch((err) => {
    errorPrint("User could not be made", err);
    if(err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    } else {
      next(err);
    }
  });
  // console.log(req.body);
  // res.send(req.body);
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  let userId;
  db.execute("SELECT id, username, password FROM users WHERE username=?", [username])
  .then(([results, fields]) => {
    if(results && results.length == 1) {
      let hashedPassword = results[0].password;
      userId = results[0].id;
      return bcrypt.compare(password, hashedPassword);
      // return db.execute("SELECT username, password FROM users WHERE username=? AND password=?;", [username, password]);
    } else {
      throw new UserError("User does not exist.", "/login", 200);
    }
  })
  .then((passwordsMatched) => {
    if(passwordsMatched) {
      successPrint(`User ${username} is logged in.`);
      req.session.username = username;
      req.session.userId = userId;
      res.locals.logged = true;
      req.flash('success', 'You are now logged in.');
      // res.render('home', {title: "Home | imagetree", css: ['home.css'], js: ['home.js']});
      res.redirect("/home");
    } else {
      throw new UserError("Password is incorrect.", "/login", 200);
    }
  })
  .catch((err) => {
    errorPrint("User login failed!");
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    } else {
      next(err);
    }
  });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint("Error: Session could not be destroyed.");
      next(err);
    } else{
      successPrint("Session was destroyed.");
      res.clearCookie('csid');
      res.json({status: "OK", message: "User was logged out."});
    }
  })
});

module.exports = router;
