'use strict';

var async = require('async');
var db = require('../database.js');
var parseService = require('./services/parsing/readFilesForParsing.js');
var downloadService = require('./services/downloading/gitHubRepoGrabber.js');
var queryService = require('./services/query.js');
var fileSystemUtilities = require('./services/fileSystem/utilities');
var retirejs = require('./services/retirejs/retire.js');
var scanjs = require('./services/scanjs/scanner.js');

// async library to make sure we don't delete files before db is updated

var processRepo = function(repoID) {
  // gets individual records from the database and then returns an array with at least 3 of them
  console.log('starting queryService to get repo...');
  queryService.query(repoID, function(repoObj){
    // makes dirs and downloads repos for chosen repo
    console.log('starting downloadService to DL repos...');
    downloadService.readListOfFiles(repoObj, function(repoID){
      // db connection with our Repos
      var repos = db.get('Repos');
      var fullRelativePath = __dirname + '/../git_data/' + repoID;

      // async library function that lets you run async functions in parallel and wait until 
      // they're all finished before continuing (we wait for everything to finish before deleting files)
      async.series([
          function(callback){
            // run scanjs
            console.log('starting scanJS...');
            var scanResults = scanjs.scanDir(fullRelativePath);
            console.log('scanResults: ', scanResults);
            if (!scanResults) {
              console.log('no results from scanjs!');
            }

            // add scan results to the DB
            repos.findAndModify({_id: repoID}, {$set: {'repo_info.scan_results': JSON.stringify(scanResults)}}, function(err, doc) {
              console.log('record updated with scanResults...');
              callback(null, 'scan');
            });
          },

          function(callback){
            // run retirejs
            console.log('starting retireJS...');
            var retireResults = retirejs.retireScan(fullRelativePath);
            console.log('retireResults: ', retireResults);
            // add retire results to the DB
            repos.findAndModify({_id: repoID}, {$set: {'repo_info.retire_results': retireResults}}, function(err, doc) {
              if (err) {
                console.log('db err: ', err);
              }
              console.log('record updated with retireResults...');
              callback(null, 'retire');
            });
          },

          function(callback){
            console.log('starting api_key scan...');
            parseService.parseFile(repoID, function(parseResults) {
              repos.findAndModify({_id: repoID}, {$set: {'repo_info.parse_results': parseResults}}, function(err, doc) {
                console.log('record updated with parseResults...');
                callback(null, 'parse');
              });
            });
          }
      ],

      // called once all three fn's above are done
      function(err, results){
          if (err) {
            console.log('something went wrong in the parallel exec!');
            console.log('error: ', err);
          } else {
            console.log('results: ', results);
            console.log('repoID: ', repoID);
            // delete the repo here
            fileSystemUtilities.removeDirectoryAsync(__dirname + '/../git_data/' + repoID);  
          }
      });

    });
  });
};

var initialize = function() {
  console.log('Initializing GitSecure and cleaning from last cycle');
  var pathToData = __dirname + '/../git_data';
  fileSystemUtilities.removeDirectorySync(pathToData);
  console.log('system ready to process repos...');
  
};

initialize();
