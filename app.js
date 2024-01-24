var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expresssValidator = require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var paragraphs = require('lines-to-paragraphs');


var app = express();

var bodyParser = require ('body-parser');

var mysql = require ('mysql');
//auth
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);


//connected to express mysql
var myConnection = require('express-myconnection'), // express-myconnection module
    dbOptions = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'persipura',
        multipleStatements: true
    };
app.use(myConnection(mysql, dbOptions, 'request'));

//connect to database
var connection = mysql.createConnection(dbOptions);
connection.connect();
var sessionStore = new MySQLStore(dbOptions);

 //session
app.use(session({
    secret: 'secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
	}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
