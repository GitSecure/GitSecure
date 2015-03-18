var mkdirp = require('mkdirp');
var clone = require("nodegit").Clone.clone;
var mainApp = require('../../../app.js');



exports.readListOfFiles = function(urlList){
  var x = 0;
  var strId = [];

  for(var i = 0; i < urlList.length; i++){
	  strId[i] = urlList[i].id.toString();
	  mkdirp("git_data/" + strId[i], function(err){
	  })
	  clone(urlList[i].url, "git_data/" + strId[i]).then(function(repo){
	  	mainApp.parseQueue.push(strId[x]);
	  	mainApp.downloadQueue.shift();
	  	x++;
	  })
	}
}