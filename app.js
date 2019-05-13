var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// create a server
var app = express();
var exphbs = require("express-handlebars");

// enable sessions in this server through the req.session variable
app.use(session({
  secret: 'monSecret',
  saveUninitialized: false,
  resave: false
}));

// view engine setup
app.engine("hbs", exphbs({
  defaultLayout: "../layout", //Default layout file
  extname: ".hbs",
  helpers: require("./config/handlebars-helpers.js").helpers, //helper file that gets used on our client
}));

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// declaring the routers
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var projectsRouter = require('./routes/projects');
var tasksRouter = require('./routes/tasks');
var summaryRouter = require('./routes/userSummary');
var disconnectRouter = require('./routes/disconnect');

// setting up the routers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/', projectsRouter);
app.use('/task', tasksRouter);
app.use('/summary', summaryRouter);
app.use('/disconnect', disconnectRouter);

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
