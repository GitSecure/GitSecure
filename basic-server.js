/* Import node's http module: */
var http = require("http");
var _ = require("underscore");
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');
var app = express();
var mainExecution = require("./app");
var MongoClient = require('mongodb').MongoClient;


var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/client/dist'));

app.use(bodyParser.json());
app.use(cors());

// //testing client -- fake count variable
// var counts = { scanned: 0, hits: 0 };
// var offset = 0;

// var increaseCount = function() {
//   counts.scanned += 5;
//   if (offset % 60 === 0) {
//     counts.hits += 1;
//   };
//   offset++;
// };

// // setInterval(increaseCount, 1000);
// //end testing client

var getCounts = function() {
  var db = MongoClient.connect('mongodb://127.0.0.1:27017/test7', function(err, db) {  
    var metaData = db.collection('metadata');
    var hitData = db.collection('hitdata');

    metaData.count({processed: true}, function(err, count) {
      counts.scanned = count;
    });
    hitData.count(function(err, count) {
      counts.hits = count;
    })
  });
}

app.get('/numbers', function(req,res){
  getCounts();
  res.send(201, counts);
});

app.post('/', function(req,res) {
});



