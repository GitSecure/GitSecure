'use strict';

var db = require('../database.js');
var parseService = require('./services/parsing/readFilesForParsing.js');
var downloadService = require('./services/downloading/gitHubRepoGrabber.js');
var scrapeService = require('./services/scraping.js');
var queryService = require('./services/query.js');
var fileSystemUtilities = require('./services/fileSystem/utilities');
var retirejs = require('./services/retirejs/retire.js');
var scanjs = require('./services/scanjs/scanner.js');

var getNextGitHubRepo = function() {
  scrapeService.scrapeUrls(function(){
    queryService.query(function(urlList){
      downloadService.readListOfFiles(urlList, function(parseList){
        console.log('Initiating parsing of repos');
        parseService.parseFile(parseList, function(){
          console.log('Completed execution of service cycle');
          getNextGitHubRepo();
        });
      });
    });
  });
};

var initialize = function() {
  console.log('Initializing GitSecure and cleaning from last cycle');
  var pathToData = __dirname + '/../git_data';
  fileSystemUtilities.removeDirectorySync(pathToData);
  getNextGitHubRepo();
};

db.get('count').findOne({ name: 'count' }).on('complete', function (err, doc) {
  if (err) {
    console.log(err);
  } else {
    if (!doc) {
      db.get('count').insert({count: 0}).on('complete', function(err){
        if (err) {
          console.log(err);
        }
      });
    }
  }
});

initialize();
