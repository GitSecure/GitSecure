'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var cors = require('cors');
var app = express();
var session = require('express-session');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github').Strategy;

app.use(cors());

app.use(express.static(__dirname + '/client/'));

app.get('/', function(req, res, next){
  console.log('hello')
  if (req.user || req.session.passport !== {}) {
    console.log('in the checkUser utility function, about to execute next()');
    next();
  } else {
    console.log('in the checkUser utility function, about to have the response object send "0"');
    res.send('0');
  }
});

passport.serializeUser(function(user, done){
  console.log('user about to be serialized', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(session({
  saveUninitialized: true, 
  resave: true, 
  secret: 'this is our secret'
}));

passport.use(new GitHubStrategy({
  clientID: 'secret',
  clientSecret: 'secret',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, function(accessToken, refreshToken, profile, done){
  console.log('accessToken', accessToken);
   process.nextTick(function () {
    return done(null, profile);
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',
  passport.authenticate('github', {scope: 'write:repo_hook'} ));

app.get('/auth/github/callback', 
  passport.authenticate('github', 
    { sucessRedirect: '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/error', function(req, res){
  console.log('login failed in server');
  res.redirect('/');
});

app.get('/loggedin', function(req, res){
  res.send(req.isAuthenticated() ? req.user : 'unauthorized');
});

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});


