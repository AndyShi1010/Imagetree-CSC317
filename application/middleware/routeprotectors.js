const routeProtectors = {};
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');

routeProtectors.userIsLoggedIn = function(req, res, next) {
    if (req.session.username) {
        successPrint('User is logged in');
        next();
    } else {
        errorPrint('User is not logged in');
        req.flash('error', "You must be logged in.");
        res.redirect('/login');
    }
}

routeProtectors.userNotLoggedIn = function(req, res, next) {
    if (req.session.username) {
        errorPrint('User is already logged in');
        req.flash('success', "You are already logged in.");
        res.redirect('/home');
    } else {
        successPrint('User is not logged in');
        next();
    }
}

module.exports = routeProtectors;
