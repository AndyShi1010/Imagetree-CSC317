var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');

var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;
var successPrint = require('./helpers/debug/debugprinters').successPrint;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments')

var app = express();

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname,"views/partials"),
        extname: ".hbs",
        defaultLayout: "default",
        helpers: {
            emptyObject: (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0);
            }
        }
    })
);

var mysqlSessionStore = new mysqlSession({/*Using default*/}, require('./config/database'));
app.use(sessions({
    key: "csid",
    secret: "secretsecretsecret",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});

app.use((req, res, next) => {
    console.log(req.session);
    if(req.session.username) {
        res.locals.logged = true;
    }
    next();
})

app.use('/', indexRouter);

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.use((err, req, res, next) => {
    res.status(500);
    res.render('error', {err_msg: err});
})

app.use((err, req, res, next) => {
    errorPrint(err);
    res.render('error', {err_msg: err});
});
app.use((req, res, next) => {
    res.status(404);
    res.render('error', {err_msg: "404. We can't seem to find the page you are looking for."});
});

module.exports = app;
