'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var util = require('../server/utilities.js');
// require('../server/app.js');

var session = require('express-session');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github').Strategy;

// var User = require('./db-user.js');

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/client/'));

app.get('/',function(req, res, next){
  console.log('hello')
  if (req.user || req.session.passport !== {}) {
    console.log('in the checkUser utility function, about to execute next()');
    next();
  } else {
    console.log('in the checkUser utility function, about to have the response object send "0"');
    res.send('0');
  }
} )

// Check User Middleware

// Prepare session for passport
app.use(session({saveUninitialized: true, resave: true, secret: 'this is our secret'}));

// Use passport to authenticate
app.use(passport.initialize());
app.use(passport.session());

// Use Github authentication
passport.use(new GitHubStrategy({
  clientID: '9383eeff63778d471150',
  clientSecret: 'e4e1ed909f1a2063fd4606adae6636b995229010',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, function(accessToken, refreshToken, profile, done){
  console.log('accessToken', accessToken);
  console.log('profile', profile);


  // User.findOrCreate({githubId: profile.id, username: profile.displayName}, function(err, user) {
  // 	console.log('done ', user);
    return done();
  // });

}));

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user when serializing, and finding
// the user when deserializing.
passport.serializeUser(function(user, done){
  console.log('user about to be serialized', user._id);
  done(null, user);
});

passport.deserializeUser(function(id, done){
  console.log('id to be used to deserialized', 'this is the id', id);
  User.find({githubId: id._id}, function(err, user) {
    if (err) { return err;}
    done(err, user);
  });
});


app.get('/auth/error', function(req, res){
  console.log('login failed in server');
  res.redirect('/');
});

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/error' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// app.get('/auth/github', function(req, res, next) {
//   console.log('in the /auth path, trying to authenticate the user with passport');
//   next();
// },
//   passport.authenticate('github', { failureRedirect: '/auth/error'}), function(req, res, next) {
//   console.log('Authenticated through the github strategy, executing the next piece of middleware and redirecting to /main');
//   console.log(req.user);
//   res.redirect('/#/main');
// });

// // app.get('/auth/error', auth.error);
// app.get('/auth/github/callback', 
//   passport.authenticate('github', {failureRedirect: '/auth/error'})
//   // auth.callback
// );


app.use(bodyParser.json());
app.use(cors());
