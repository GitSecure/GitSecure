var metaData = GLOBAL.db.collection('metadata');
metaData.find({processed: false}).toArray(function(err, body) {
  for (var i = 0;i < body.length;i++) {
    gitHubRepoGrabber.readListofFiles(body[i].git_url, body[i].id);
  }
});
