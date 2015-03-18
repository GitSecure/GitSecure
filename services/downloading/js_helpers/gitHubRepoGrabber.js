var mkdirp = require('mkdirp');
var clone = require("nodegit").Clone.clone;
var mainApp = require('../../../app.js');



exports.readListOfFiles = function(urlList, callback){
  var x = 0;
  var directoryList = [];
  var strId = [];

  var onCompletion = function(){
    for(var i = 0; i < urlList.length; i++){
  	  strId[i] = urlList[i].id.toString();
  	  mkdirp("git_data/" + strId[i], function(err){
  	  })
  	  clone(urlList[i].url, "git_data/" + strId[i]).then(function(repo){
  	  	directoryList.push(strId[x]);
  	  	x++;
  	  })
  	}
    callback(directoryList);  
  }

  onCompletion();
  

}