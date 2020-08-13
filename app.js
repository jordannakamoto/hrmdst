var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const fetch = require('node-fetch');
require('./passport-setup');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// Define Cookie Session
app.use(cookieSession({
	name: 'session',
	keys: ['key1','key2']
}));

// validate session midddleware
const isLoggedIn = (req, res, next) => {
		if(req.user){
			next();
		} else {
			res.sendStatus(401);
		}
}

var test = () => {
fetch('https://api.typeform.com/forms/JpSFde/responses')
  .then(response => response.json())
  .then(data => {
    console.log(data);
	res.render("succes",{data});
  })
}


// Passport JS Init / Routes
app.use(passport.initialize());
app.use(passport.session());

// success/fail paths
app.get('/failed', (req,res) => res.send("You failed to log in"));
app.get('/good', isLoggedIn,(req,res) => {test});


app.get('/auth',
  passport.authenticate('oauth2', {scope: ['responses:read']}));

app.get('/auth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/authfail' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });
  
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});


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
