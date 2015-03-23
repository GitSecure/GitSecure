var MongoClient = require('mongodb').MongoClient;

var counts = { scanned: 0, hits: 0 };

exports.getCounts = function() {
  var db = MongoClient.connect('mongodb://127.0.0.1:27017/test7', function(err, db) {  
    var metaData = db.collection('metadata');
    var hitData = db.collection('hitdata');

    metaData.findOne({"count" : {$exists: true}}, function(err, doc){
      counts.scanned = doc.count;
      console.log(doc)
    });
    hitData.count(function(err, count) {
      counts.hits = count;
    })
  });
  return counts;
}