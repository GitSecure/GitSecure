'use strict';

var mkdirp = require('mkdirp');
var clone = require('nodegit').Clone.clone;
var async = require('async');

exports.readListOfFiles = function(repoObj, endAsyncLoopCallback) {
  // for each git item passed in asynchronously make a directory
  // and then use nodegit to clone the entire repo into that dir
  /*
  repoObj structure:  
  {"repo_id": 11667865,
  "repo_info": {
    "git_url": "git://github.com/reactjs/react-rails.git",
    "name" : "react-rails",
    "scan_results" : "",
    "retire_results" : "",
    "parse_results" : "",
    "users" : [6412038], 
    }
  }
  */
  var repositoryId = repoObj._id.toString();
  var repositoryUrl = repoObj.repo_info.git_url;
  var repositoryPath = 'git_data/' + repositoryId;
  console.log('Downloading Repository: ' + repositoryUrl);

  mkdirp(repositoryPath);

  clone(repositoryUrl, repositoryPath)
    .then(function(){
        // once each item is done add the id to the directoryList array
        console.log('cloning finished.');
        endAsyncLoopCallback(repositoryId);
    });

};
