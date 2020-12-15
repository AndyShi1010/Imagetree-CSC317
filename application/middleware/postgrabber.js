const db = require('../config/database');
const postGrabber = {};

postGrabber.getRecentPosts = function(req, res, next) {
    let baseSQL = "SELECT id, title, description, thumbpath, created FROM posts ORDER BY created DESC LIMIT 20";
    db.execute(baseSQL,[])
    .then(([results, fields]) => {
        res.locals.results = results;
        if (results && results.length == 0) {
            req.flash('error', 'There are no posts');
        }
        next();
    })
    .catch((err) => next(err));
}

module.exports = postGrabber;