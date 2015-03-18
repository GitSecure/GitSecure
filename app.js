// var db = require("./services/scraping.js");
var parser = require("./services/parsing/readFilesForParsing.js")
var downloader = require('./services/downloading/js_helpers/gitHubRepoGrabber.js')
var scraper = require('./services/scraping.js');
var query = require('./services/query.js');



// var toTest = [{url: 'git://github.com/Sourdoughh/Backend-Demo-For-Hilarious-Pancake.git' , id: '81' }, {url: 'git://github.com/showdownjs/showdown.git', id:'59'}]

var getNext = function() {
    scraper.scrapeUrls(function(){
      query.query(function(urlList){
        console.log("in download mode")
        downloader.readListOfFiles(urlList, function(parseList){
          console.log('readlistoffiles cb', parseList)
          // parser.parseFile(parseList, function(){

          // });
        });
      })
    });
    // setTimeout(function() {
    //  getNext(); 
    // }, 20000);
 }

// setInterval(getNext,4000);
getNext();