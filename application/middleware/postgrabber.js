// const db = require('../config/database');
const {getRecentPosts, getPostById}= require('../models/Posts');
const {getCommentsForPost} = require('../models/Comments');
const { post } = require('../routes');
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
        let results = await getRecentPosts(20);
        res.locals.results = results;
        if(results.length == 0) {
            req.flash('error', 'There are no posts');
        }
        next();
    } catch(err) {
        next(err);
    }
}

postGrabber.getPostById = async function(req, res, next) {
    try {
        let postId = req.params.id;
        let results = await getPostById(postId);
        if (results && results.length) {
            let post = results[0];
            res.locals.currentPost = results[0];
            res.locals.title = `${post.title} by ${post.username} | imagetree`;
            next();
        } else {
            req.flash("error", "Could not find post.");
            res.redirect("/home");
        }
    } catch (err) {
        next(err);
    }
}

postGrabber.getCommentsByPostId = async function(req, res, next) {
    try {
        let postId = req.params.id;
        let results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = postGrabber;