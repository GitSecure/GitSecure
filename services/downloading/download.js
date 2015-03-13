var MongoClient = require('mongodb').MongoClient;

var gitHubRepoGrabber = require("./js_helpers/gitHubRepoGrabber");
var readFilesForParsing = require("./js_helpers/readFilesForParsing");

MongoClient.connect('mongodb://127.0.0.1:27017/test4', function(err, db) {
    var metaData = db.collection('metadata');
    metaData.find({}).toArray(function(err, body) {
      for (var i = 0;i < body.length;i++) {
        gitHubRepoGrabber.readListofFiles(body[i].git_url, body[i].id);
        console.log(body[i].git_url);
        console.log(body[i].id);
      }
    });
});