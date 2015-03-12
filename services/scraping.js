var MongoClient = require('mongodb').MongoClient;
var request = require('request');

var options = {};
//options.url = 'https://api.github.com?q=created%3A%3E2015-03-12&type=Repositories';
options.url = 'https://api.github.com/search/repositories?q=sort=updated&order=desc&page=1&per_page=53';
options.headers = {
  'User-Agent': 'request'
};

var reportResults = function(err, result) {
  if (err) console.log("ERROR: " + err);
  console.log("RESULT: " + result);
}

var formatUrl = function(fullName) {
  return {'url': 'https://github.com/' + fullName + '.git'};
}

MongoClient.connect('mongodb://127.0.0.1:27017/test2', function(err, db) {
    var metaData = db.collection('metadata');
    var urls = db.collection('urls');

    request(options, function(err, res, body) {
        var data = JSON.parse(body).items;
        for (var i = 0; i < data.length - 1;i++) {
            console.log(data.length);
            metaData.insert(data[i], reportResults);
            urls.insert(formatUrl(data[i].full_name), reportResults);
        }
    });
});
