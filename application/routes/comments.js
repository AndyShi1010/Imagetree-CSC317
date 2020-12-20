var express = require('express');
const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
var router = express.Router();
const {getRecentPosts, getPostById} = require('../middleware/postgrabber');
const {create, getCommentsForPost} = require('../models/Comments');

router.post("/create", (req, res, next) => {
    // res.send("Comment success");
    if(!req.session.username) {
        errorPrint("Must be logged in to comment");
        res.json({
            code: -1,
            status: "danger",
            message: "Must be logged in to comment"
        });
    } else {
        let {comment, postId} = req.body;
        let username = req.session.username;
        let userId = req.session.userId;
        create(userId, postId, comment)
        .then((wasSuccessful) => {
        if(wasSuccessful != -1) {
            successPrint(`${username}'s comment was created.`);
            res.json({
                code: 1,
                status: "success",
                message: "Comment created"
            })
        } else {
            errorPrint("Comment failed");
            res.json({
                code: -1,
                status: "danger",
                message: "Comment was not created"
            })
        }
        })
        .catch((err) => next(err));
    }
});

router.get("/getComments/:id(\\d+)", (req, res, next) => {
    // res.send(req.params.id);
    let postId = req.params.id;
    getCommentsForPost(postId)
    .then((results) => {
        res.json(results);
    })
    .catch((err) => next(err));
})

module.exports = router;