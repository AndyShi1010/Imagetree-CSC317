const db = require('../config/database');
const {getProfile} = require('../models/Users');
const userInfoGrabber = {};

userInfoGrabber.getProfile = async function(req, res, next) {
    let userId = req.session.userId;
    if (userId == undefined) {
        next();
    } else {
        userId = req.session.userId;
        console.log(userId);
        try {
            let results = await getProfile(userId);
            console.log(results);
            res.locals.userPhoto = `${results.userphoto}`;
            res.locals.username = results.username;
            res.locals.userCreated = results.created;
            res.locals.userEmail = results.email;
            if(results.length == 0) {
                req.flash('error', 'Error getting userinfo');
            }
            next();
            // UserModel.getProfilePicture(userId)
            // .then((data) => {
                
            //     res.locals.userPhoto = `/public/images/userphoto/${data}`;
            //     next();
            // })
            // .catch((err) => next(err))
        } catch (err) {
            next(err);
        }
    }
}

module.exports = userInfoGrabber;