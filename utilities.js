var MongoClient = require('mongodb').MongoClient;

var counts = { scanned: 0, hits: 0 };

exports.getCounts = function() {
    var count = GLOBAL.db.collection('count');
    var hitData = GLOBAL.db.collection('hitdata');

   count.findOne({"count" : {$exists: true}}, function(err, doc){
      counts.scanned = doc.count;
    });
    hitData.count(function(err, count) {
      counts.hits = count;
    });
  return counts;
};