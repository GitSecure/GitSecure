var MongoClient = require('mongodb').MongoClient;

var counts = { scanned: 0, hits: 0 };

exports.getCounts = function() {
  var db = MongoClient.connect('mongodb://127.0.0.1:27017/development', function(err, db) {  
    var count = db.collection('count');
    var hitData = db.collection('hitdata');

   count.findOne({"count" : {$exists: true}}, function(err, doc){
      counts.scanned = doc.count;
    });
    hitData.count(function(err, count) {
      counts.hits = count;
    })
  });
  return counts;
}