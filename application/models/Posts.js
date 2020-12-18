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
    let baseSQL = "SELECT id, title, description, thumbpath, concat_ws(' ', title, description) AS haystack FROM posts HAVING haystack like ? LIMIT 20;"
    let sqlSearchQuery = "%" + search + "%";
    return db.execute(baseSQL, [sqlSearchQuery])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getRecentPosts = (numberOfPost) => {
    let baseSQL = "SELECT id, title, thumbpath, created FROM posts ORDER BY created DESC LIMIT 20";
    return db.execute(baseSQL,[])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

module.exports = PostModel;