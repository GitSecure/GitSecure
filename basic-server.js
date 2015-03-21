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

app.use(express.static(__dirname + '/client/dist'));

app.use(bodyParser.json());
app.use(cors());

//testing client -- fake count variable
var counts = { scanned: 0, hits: 0 };
var offset = 0;

var increaseCount = function() {
  counts.scanned += 5;
  if (offset % 60 === 0) {
    counts.hits += 1;
  };
  offset++;
};

setInterval(increaseCount, 1000);
//end testing client

app.get('/numbers', function(req,res){
  //server should actually query the database for updated count info.
  //need to add count property to database and update each time repo is 
  //scanned or api key is found
  res.send(201, counts);
});

app.post('/', function(req,res) {
});


