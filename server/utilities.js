'use strict';

var db = require('../database.js');

var counts = { scanned: 0, hits: 0 };

exports.getCounts = function() { 
  var count = db.get('count');
  var hitData = db.get('hitdata');

  count.findOne({'count': {$exists: true}}).on('complete', function(err, doc){
    if (err) {
      console.log(err);
    } else {
      counts.scanned = doc.count;  
    }
  });

  hitData.count({}).on('complete', function(err, count) {
    if (err) {
      console.log(err);
    } else {
      counts.hits = count;
    }
  });

  return counts;
};
