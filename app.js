var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/portal');
const loginRouter = require('./routes/login');
const management = require('./routes/management');
const logout = require('./routes/logout');
const contact = require('./routes/contact');
const otp = require('./routes/otp_change');
const multer = require('multer');

var app = express();
app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(
    session({
        secret: 'cyber',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/portal', usersRouter);
app.use('/login', loginRouter);
app.use('/management', management);
app.use('/logout', logout);
app.use('/otp_change', otp);
app.use('/contact', contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/"); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },
});


const upload = multer({ storage: fileStorageEngine });
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;