// var db = require("./services/scraping.js");
var parser = require("./services/parsing/readFilesForParsing.js")
var downloader = require('./services/downloading/js_helpers/gitHubRepoGrabber.js')


exports.parseQueue = parseQueue = [];
exports.downloadQueue = downloadQueue = [];


exports.populateQueue = function(data){
	for(var i = 0; i < data.length; i++){
		downloadQueue.push(data[i]);
	}
}


var toTest = [{url: 'git://github.com/Sourdoughh/Backend-Demo-For-Hilarious-Pancake.git' , id: '81' }, {url: 'git://github.com/showdownjs/showdown.git', id:'59'}]

var getNext = function() {
  if( parseQueue.length === 0 ) {
    // downloadFiles(); //['url1','url2']
    downloader.readListOfFiles(toTest)
  } else {
    console.log("downloadQueue:" + downloadQueue)
 		console.log("parseQueue:" + parseQueue) 	

    parser.parseFile(parseQueue);
  }
};

setInterval(getNext,4000);
getNext();