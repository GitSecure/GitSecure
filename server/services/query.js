'use strict';

var db = require('../../database.js');

exports.query = function(callback){
  var results = [];
  
  function getMetaDataDocument() {
    var metaData = db.get('metadata');
    metaData.findAndModify({processed: false}, [['_id','asc']], {$set: {processed: true}})
    .on('complete', function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        results.push({ git_url: doc.git_url, id: doc.id});
        handleMetaData();
      }
    });
  }

  var updateCount = function() {
    var count = db.get('count');
    count.update({'count': {$exists: true}}, {$inc : {count: 1 }})
    .on('complete', function(err) {
      if (err) {
        console.log(err);
      }
    });
  };

  function handleMetaData() {
    updateCount();
    if (results.length < 2) { // Why?
      getMetaDataDocument();
    } else {
      callback(results);
    }
  }

  getMetaDataDocument();
};
