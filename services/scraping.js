var MongoClient = require('mongodb').MongoClient;
var request = require('request');

var options = {};
options.url = 'https://api.github.com/repositories?since=0';
options.headers = {
  'User-Agent': 'request'
};

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    var metadata = db.collection('metadata');

    request(options, function(err, res, body) {
        var data = JSON.parse(body);
        for (var i = 0; i < data.length;i++) {
          metadata.insert(data[i], function(){
          });
        }
    });
});
