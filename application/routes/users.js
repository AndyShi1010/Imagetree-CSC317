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

  db.execute("SELECT * FROM users WHERE username=?", [username])
  .then(([results, fields]) => {
    if(results && results.length == 0) {
      return db.execute("SELECT * FROM users WHERE email=?", [email]);
    } else {
      throw new UserError("Registration Failed: Username already exists", "/signup", 200);
    }
  })
  .then(([results, fields]) => {
    if(results && results.length == 0) {
      return bcrypt.hash(password, 12);
    } else {
      throw new UserError("Registration Failed: Email already exists", "/signup", 200);
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
      res.redirect('/login');
    } else {
      throw new UserError("Server Error: User could not be created", "/signup", 500);
    }
  })
  .catch((err) => {
    errorPrint("User could not be made", err);
    if(err instanceof UserError) {
      errorPrint(err.getMessage());
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
      throw new UserError("Error: User does not exist", "/login", 200);
    }
  })
  .then((passwordsMatched) => {
    if(passwordsMatched) {
      successPrint(`User ${username} is logged in.`);
      req.session.username = username;
      req.session.userId = userId;
      res.locals.logged = true;
      // res.render('home', {title: "Home | imagetree", css: ['home.css'], js: ['home.js']});
      res.redirect("/home");
    } else {
      throw new UserError("Password is incorrect.", "/login", 200);
    }
  })
  // .then(([results, fields]) => {
  //   if (results && results.length == 1) {
  //     successPrint(`User ${username} is logged in.`);
  //     res.locals.logged = true;
  //     res.render('home', {title: "Home | imagetree", css: ['home.css'], js: ['home.js']});
  //   } else {
  //     throw new UserError("Invalid username and/or password!", "/login", 200);
  //   }
  // })

  // let baseSQL = "SELECT username, password FROM users WHERE username=? AND password=?;"
  // db.execute(baseSQL, [username, password])
  // .then(([results, fields]) => {
  //   if (results && results.length == 1) {
  //     successPrint(`User ${username} is logged in.`);
  //     res.redirect('/home');
  //   } else {
  //     throw new UserError("Invalid username and/or password!", "/login", 200);
  //   }
  // })
  .catch((err) => {
    errorPrint("User login failed!");
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
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
