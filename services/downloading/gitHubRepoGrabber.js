var mkdirp = require('mkdirp');
var clone = require("nodegit").Clone.clone;
var async = require('async');

exports.readListOfFiles = function(urlList, endAsyncLoopCallback) {
  var directoryList = [];

  async.eachSeries(urlList, function(urlObj, itemCallback) {
    var repositoryId = urlObj.id.toString();
    var repositoryUrl = urlObj.git_url;
    var repositoryPath = "services/parsing/git_data/" + repositoryId;
    console.log("Downloading Repository: " + repositoryUrl);

    mkdirp(repositoryPath);
    clone(repositoryUrl, repositoryPath)
      .then(function(){
        directoryList.push(repositoryId);
        itemCallback();
    });
  }, 
  function() {
    //Executed after all items are processed
    endAsyncLoopCallback(directoryList);
  });
};
