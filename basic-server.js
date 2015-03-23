/* Import node's http module: */
var http = require("http");
var _ = require("underscore");
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');
var app = express();
var mainExecution = require("./app");
var util = require("./utilities");
<<<<<<< HEAD
var MongoClient = require('mongodb').MongoClient;
=======
>>>>>>> Create utilities file. Moved getCounts out of basic server to utilities.


var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/client/dist'));

app.use(bodyParser.json());
app.use(cors());

app.get('/numbers', function(req,res){
  var counts = util.getCounts();
  res.send(201, counts);
});


app.post('/', function(req,res) {
});



