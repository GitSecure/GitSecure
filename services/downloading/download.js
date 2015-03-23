var gitHubRepoGrabber = require("./js_helpers/gitHubRepoGrabber");
var readFilesForParsing = require("./js_helpers/readFilesForParsing");

var metaData = GLOBAL.db.collection('metadata');
metaData.find({processed: false}).toArray(function(err, body) {
  for (var i = 0;i < body.length;i++) {
    console.log(body.git_url);
    gitHubRepoGrabber.readListofFiles(body[i].git_url, body[i].id);
    console.log(body[i].git_url);
    console.log(body[i].id);
  }
});
