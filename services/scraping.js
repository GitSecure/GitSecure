var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var mainApp = require('../app.js');

var options = {};
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


exports.dataBase = MongoClient.connect('mongodb://127.0.0.1:27017/test4', 

  function(err, db) {  
    var metaData = db.collection('metadata');

    request(options, function(err, res, body) {
        var data = JSON.parse(body).items;
        var dataGitUrls = [];
        for (var i = 0; i < data.length - 1;i++) {
          metaData.insert(data[i], reportResults);
          dataGitUrls.push(data[i].id);

        }
    });
});
