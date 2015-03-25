'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var util = require('./server/utilities.js');
require('./server/app.js'); //require used to launch

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/client/dist'));

app.use(bodyParser.json());
app.use(cors());

app.get('/numbers', function(req, res){
  var counts = util.getCounts();
  res.send(201, counts);
});
