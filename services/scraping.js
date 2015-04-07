exports.scrapeUrls = function(callback){
  var request = require('request');

  var options = {};

  var dateString = new Date(Date.now() - 28000).toISOString();

  options.url = 'https://api.github.com/search/repositories?q=pushed:>=' + dateString + '&order=desc&per_page=100';

  options.headers = {
    'User-Agent': 'request'
  };

  var reportResults = function(err, result) {
    if (err) console.log("ERROR: " + err);
  };

  var formatUrl = function(fullName) {
    return {'url': 'https://github.com/' + fullName + '.git'};
  };


  var metaData = GLOBAL.db.collection('metadata');
  request(options, function(err, res, body) {
    console.log('Downloading most recent GitHub repo urls');
    var data = JSON.parse(body).items;
    var dataGitUrls = [];
    for (var i = 0; i < data.length - 1;i++) {
      data[i].processed = false;
      // checks to see if repo is less than 100MB
      if(data[i].size < 100000){
        metaData.insert(data[i], reportResults);
      }
    }
    callback();
  });
}
