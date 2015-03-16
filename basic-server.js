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

var getTextFile = function(path, callback) {
  var content;
  fs.readFile(path, function (err, data) {
      if (err) {
          throw err;
      }
      content = data;
      console.log(content);   
      callback(content);        
  });
};

var removeFile = function(path, callback) {
  fs.unlink(path, function (err) {
    if (err) {
      throw err;
    }
    else {
      console.log('successfully deleted ', path);
      callback();
    }
  });
};

var removeDirectory = function(path, callback) {
  fs.readdir(path, function(err, files) {
    if(err) {
      callback(err, []);
      return;
    }
    var wait = files.length;
    var count = 0;

    var folderDone = function(err) {
      count++;
      if( count >= wait || err) {
        fs.rmdir(path, callback);
      }
    };

    // Empty directory to bail early
    if( !wait ) {
      folderDone();
      return;
    }
    
    // Remove one or more trailing slash to keep from doubling up
    path = path.replace(/\/+$/,"");
    files.forEach(function(file) {
      var curPath = path + "/" + file;
      fs.lstat(curPath, function(err, stats) {
        if( err ) {
          callback(err, []);
          return;
        }
        if( stats.isDirectory() ) {
          removeDirectory(curPath, folderDone);
        } else {
          fs.unlink(curPath, folderDone);
        }
      });
    });
  });
};