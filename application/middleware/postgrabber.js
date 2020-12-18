// const db = require('../config/database');
var PostModel = require('../models/Posts')
const postGrabber = {};

// postGrabber.getRecentPosts = function(req, res, next) {
//     let baseSQL = "SELECT id, title, description, thumbpath, created FROM posts ORDER BY created DESC LIMIT 20";
//     db.execute(baseSQL,[])
//     .then(([results, fields]) => {
//         res.locals.results = results;
//         if (results && results.length == 0) {
//             req.flash('error', 'There are no posts');
//         }
//         next();
//     })
//     .catch((err) => next(err));
// }


postGrabber.getRecentPosts = async function(req, res, next) {
    try {
        let results = await PostModel.getRecentPosts(10);
        res.locals.results = results;
        if(results.length == 0) {
            req.flash('error', 'There are no posts');
        }
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = postGrabber;