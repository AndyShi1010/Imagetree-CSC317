var express = require('express');
var router = express.Router();
var db = require('../config/database');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var UserError = require('../helpers/error/UserError');
var bcrypt = require('bcrypt');
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, "public/images/userphoto");
  },
  filename: function(req, file, cb) {
      let fileExt = file.mimetype.split('/')[1];
      let randomName = crypto.randomBytes(22).toString("hex");
      cb(null, `${randomName}.${fileExt}`)
  }
});

var uploader = multer({storage: storage});

const UserModel = require("../models/Users");
const { Router } = require('express');
const { fstat } = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  // throw new UserError('Post could not be created.', '/post', 200);
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

  UserModel.usernameExists(username)
  .then((usernameExists) => {
    if(usernameExists) {
      throw new UserError("Username already exists", "/signup", 200);
    }else {
      return UserModel.emailExists(email);
    }
  })
  .then((emailExists) => {
    if(emailExists) {
      throw new UserError("Email already exists", "/signup", 200);
    }else {
      return UserModel.create(username, email, password);
    }
  })
  .then((createdUserId) => {
    if (createdUserId < 0) {
      throw new UserError("Server Error: User could not be created", "/signup", 500);
    } else {
      successPrint("User.js: User was created");
      req.flash('success', 'Your account is now ready.');
      res.redirect('/login');
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
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  UserModel.authenticate(username, password)
  .then((loggedUserId) => {
    if(loggedUserId > 0) {
      successPrint(`User ${username} is logged in.`);
      req.session.username = username;
      req.session.userId = loggedUserId;
      res.locals.logged = true;
      res.locals.username = username;
      req.flash('success', 'You are now logged in.');
      res.redirect("/home");
    } 
    else if(loggedUserId == -1) {
      throw new UserError("Invalid password.", "/login", 200);
    } 
    else {
      throw new UserError("User does not exist.", "/login", 200);
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

router.post('/updateProfilePic', uploader.single("file"), (req, res, next) => {
  let fileUploaded = req.file.path;
  let newFile = req.file.destination + `/pfp-${req.file.filename}`;
  let userId = req.session.userId;

  sharp(fileUploaded).resize({
    width: 200,
    height: 200,
    fit: sharp.fit.center}).toFile(newFile)
    .then(() => {
      return UserModel.changeProfilePic(newFile, userId);
    })
    .then((userChanged) => {
      if(userChanged) {
          req.flash('success', "Your profile was updated!");
          res.redirect('/settings');
      } else {
          throw new PostError('Your profile could not be updated', '/settings', 200);
      }
    })
    .then((result) => {
      fs.unlink(fileUploaded, ((err) => {if(err){console.log(err);}}));
      res.send(result + " " + fileUploaded);
    })
    .catch((err) => {
      next(err);
    })
})

router.post('/updateProfileName', (req, res, next) => {
  let username = req.body.username;
  let userId = req.session.userId;

  UserModel.usernameExists(username)
  .then((usernameExists) => {
    if(usernameExists) {
      throw new UserError("Username already exists", "/settings", 200);
    }else {
      return UserModel.changeUsername(username, userId);
    }
  })
  .then((userChanged) => {
    if(userChanged) {
      req.flash('success', "Your profile was updated!");
      res.redirect('/settings');
    } else {
      throw new PostError('Your profile could not be updated', '/settings', 200);
    }
  })
  .catch((err) => {
    errorPrint("User info update failed!");
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    } else {
      next(err);
    }
  });
})

router.post('/updateProfileEmail', (req, res, next) => {
  let email = req.body.email;
  let userId = req.session.userId;

  UserModel.emailExists(email)
  .then((emailExists) => {
    if(emailExists) {
      throw new UserError("Email already exists", "/settings", 200);
    }else {
      return UserModel.changeEmail(email, userId);
    }
  })
  .then((userChanged) => {
    if(userChanged) {
      req.flash('success', "Your profile was updated!");
      res.redirect('/settings');
    } else {
      throw new PostError('Your profile could not be updated', '/settings', 200);
    }
  })
  .catch((err) => {
    errorPrint("User info update failed!");
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    } else {
      next(err);
    }
  });
})

module.exports = router;
