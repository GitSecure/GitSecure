'use strict';

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
});
