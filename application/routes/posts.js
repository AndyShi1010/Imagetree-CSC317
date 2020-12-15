var express = require('express');
var router = express.Router();
var db = require('../config/database');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostError');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images/uploads");
    },
    filename: function(req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`)
    }
});

var uploader = multer({storage: storage});

router.post('/createPost', uploader.single("file"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let thumbDestionation = req.file.destination + "/thumbs/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    /**
     * Validation
     */
    if (description == undefined) {
        description = "";
    }

    sharp(fileUploaded).resize(500).toFile(thumbDestionation)
    .then(() => {
        let baseSQL = "INSERT INTO posts (title, description, photopath, thumbpath, created, fk_userid) VALUE (?,?,?,?, now(),?);";
        return db.execute(baseSQL, [title, description, fileUploaded, thumbDestionation, fk_userId]);
    })
    .then(([results, fields]) => {
        if(results && results.affectedRows) {
            req.flash('success', "Your post was uploaded!");
            res.redirect('/home');
        } else {
            throw new PostError('Post could not be created.', '/post', 200);
        }
    })
    .catch((err) => {
        if (err instanceof PostError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        } else {
            next(err);
        }
    }) 
})

module.exports = router;