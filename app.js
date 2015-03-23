var MongoClient = require('mongodb').MongoClient;
var parseService = require("./services/parsing/readFilesForParsing.js");
var downloadService = require('./services/downloading/gitHubRepoGrabber.js');
var scrapeService = require('./services/scraping.js');
var queryService = require('./services/query.js');
var fileSystemUtilities = require('./services/fileSystem/utilities');

var initialize = function() {
  var pathToData = __dirname + '/services/parsing/git_data';
  fileSystemUtilities.removeDirectorySync(pathToData);
  getNextGitHubRepo();
};

var getNextGitHubRepo = function() {
  MongoClient.connect('mongodb://127.0.0.1:27017/development', function(err, db) {
    GLOBAL.db = db;
    scrapeService.scrapeUrls(function(){
      queryService.query(function(urlList){
        downloadService.readListOfFiles(urlList, function(parseList){
          parseService.parseFile(parseList, function(){
            console.log('parsed everything!');
            getNextGitHubRepo();
          });
        });
      });
    });
  });
};

MongoClient.connect('mongodb://127.0.0.1:27017/development', function(err, db) {
  db.collectionNames("count", function(err, names) {
    console.log(names)
    if (names.length === 0) {
      db.collection('count').insert({count: 0}, function(){});
    } else {
      console.log("already exists")
    }
  })
});


initialize();
