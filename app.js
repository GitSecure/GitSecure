// var db = require("./services/scraping.js");
var parseService = require("./services/parsing/readFilesForParsing.js");
var downloadService = require('./services/downloading/js_helpers/gitHubRepoGrabber.js');
var scrapeService = require('./services/scraping.js');
var queryService = require('./services/query.js');
var pageNumber = 1;



var initialize = function() {
  //kill git_data
  //getNextGitHubRepo();
};

var getNextGitHubRepo = function() {
    scrapeService.scrapeUrls(++pageNumber, function(){
      queryService.query(function(urlList){
        downloadService.readListOfFiles(urlList, function(parseList){
          parsService.parseFile(parseList, function(){
            console.log('parsed everything!');
          });
        });
      });
    });
    setTimeout(function() {
     getNextGitHubRepo(); 
    }, 30000  );
};
getNextGitHubRepo();
