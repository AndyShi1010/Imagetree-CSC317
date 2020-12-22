var db = require('../config/database');
const UserModel = {};
var bcrypt = require('bcrypt');

UserModel.create = (username, email, password) => {
    return bcrypt.hash(password, 15)
    .then((hashedPassword) => {
        let baseSQL = "INSERT INTO users(`username`,`email`,`password`,`userphoto`,`created`)VALUES(?,?,?,?,now());"
        return db.execute(baseSQL, [username, email, hashedPassword, "public/images/userphoto/defaultuserphoto.png"]);
    })
    .then(([results, fields]) => {
        if (results && results.affectedRows) {
            return Promise.resolve(results.insertId);
        } else {
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
}

UserModel.usernameExists = (username) => {
    return db.execute("SELECT * FROM users WHERE username=?", [username])
    .then(([results, fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

UserModel.emailExists = (email) => {
    return db.execute("SELECT * FROM users WHERE email=?", [email])
    .then(([results, fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

UserModel.authenticate = (username, password) => {
    let userId;
    return db.execute("SELECT id, username, password FROM users WHERE username=?", [username])
    .then(([results, fields]) => {
        if(results && results.length == 1) {
            userId = results[0].id;
            return bcrypt.compare(password, results[0].password);
        } else {
            return Promise.resolve(-1);
        }
    })
    .then((passwordsMatch) => {
        if(passwordsMatch) {
            return Promise.resolve(userId);
        }else {
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
}

UserModel.getProfile = (userId) => {
    let userPhoto;
    // console.log(userId);
    return db.execute("SELECT userphoto, username, email, created FROM users where id=?", [userId])
    .then(([results, fields]) => {
        // console.log(results);
        if (results && results.length == 1) {
            return results[0];
        } else {
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
}

UserModel.changeProfilePic = (file, userId) => {
    return db.execute("UPDATE users SET userphoto=? WHERE id=?;", [file, userId])
    .then(([results, fields]) => {
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
}

UserModel.changeUsername = (username, userId) => {
    return db.execute("UPDATE users SET username=? WHERE id=?;", [username, userId])
    .then(([results, fields]) => {
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
}

UserModel.changeEmail = (email, userId) => {
    return db.execute("UPDATE users SET email=? WHERE id=?;", [email, userId])
    .then(([results, fields]) => {
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
}

module.exports = UserModel;