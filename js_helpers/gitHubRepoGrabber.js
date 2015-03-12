var mkdirp = require('mkdirp');
var clone = require("nodegit").Clone.clone;

var counter = 0 // to keep count in database

exports.readListofFiles = function(list){
 	var stringCounter = counter.toString();
  mkdirp("git_data/" + stringCounter, function(err){
  })
  clone(list[0], "git_data/" + stringCounter);
  counter++
}