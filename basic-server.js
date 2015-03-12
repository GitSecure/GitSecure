/* Import node's http module: */
var http = require("http");
var _ = require("underscore");
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');
var app = express();
var mainExecution = require("./app");



var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});

// app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(cors());

app.get('', function(req,res){
});

app.post('/', function(req,res) {
});