'use strict';

var childProcess = require('child_process');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});

app.use(bodyParser.json());

app.post('/', function(req, res){
  console.log(req.body);
  if (req.body.repository.full_name === 'graffiome/GitSecure') {
    var execOptions = {
      cwd: '../',
    };
    var gitCmd = 'git pull --rebase origin master';
    var npmCmd = 'npm install';
    var bowerCmd = 'bower install';
    childProcess.exec(gitCmd, execOptions, function(err, stdout, stderr){
      if (err) {console.error(err);}
      if (stdout) {console.log(stdout);}
      if (stderr) {console.warn(stderr);}
      childProcess.exec(npmCmd, execOptions, function(err, stdout, stderr){
        if (err) {console.error(err);}
        if (stdout) {console.log(stdout);}
        if (stderr) {console.warn(stderr);}
      });
      childProcess.exec(bowerCmd, execOptions, function(err, stdout, stderr){
        if (err) {console.error(err);}
        if (stdout) {console.log(stdout);}
        if (stderr) {console.warn(stderr);}
      });
    });
  }
  res.end();
});
