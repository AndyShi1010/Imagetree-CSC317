var db = require('../config/database');
const PostModel = {};

PostModel.create = (title, description, photopath, thumbpath, fk_userId) => {
    let baseSQL = "INSERT INTO posts (title, description, photopath, thumbpath, created, fk_userid) VALUE (?,?,?,?, now(),?);";
    return db.execute(baseSQL, [title, description, photopath, thumbpath, fk_userId])
    .then(([results, fields]) => {
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.search = (search) => {
    let baseSQL = "SELECT id, title, description, thumbpath, concat_ws(' ', title, description) AS haystack FROM posts HAVING haystack like ? ORDER BY created DESC LIMIT 20;"
    let sqlSearchQuery = "%" + search + "%";
    return db.execute(baseSQL, [sqlSearchQuery])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getRecentPosts = (numberOfPosts) => {
    console.log(numberOfPosts);
    let baseSQL = "SELECT id, title, thumbpath, created FROM posts ORDER BY created DESC LIMIT ?;";
    return db.execute(baseSQL,[numberOfPosts.toString()])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

PostModel.getPostById = (postId) => {
    let baseSQL = "SELECT u.username, u.userphoto, p.title, p.description, p.photopath, p.created FROM users u JOIN posts p ON u.id=fk_userid WHERE p.id=?;";
    return db.execute(baseSQL, [postId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

module.exports = PostModel;