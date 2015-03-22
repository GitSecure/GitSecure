// var db = require("./services/scraping.js");
debugger;
var parseService = require("./services/parsing/readFilesForParsing.js");
var downloadService = require('./services/downloading/js_helpers/gitHubRepoGrabber.js');
var scrapeService = require('./services/scraping.js');
var queryService = require('./services/query.js');
module.pageNumber = 1;


  //kill git_data
  //getNextGitHubRepo();

var getNextGitHubRepo = function() {
    scrapeService.scrapeUrls(++module.pageNumber, function(){
      queryService.query(function(urlList){
        downloadService.readListOfFiles(urlList, function(parseList){
          parseService.parseFile(parseList, function(){
            console.log('parsed everything!');
            getNextGitHubRepo();
          });
        });
      });
    });
};

getNextGitHubRepo();
