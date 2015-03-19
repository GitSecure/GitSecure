exports.query = function(callback){
  var MongoClient = require('mongodb').MongoClient;
  var results = [];

  var db = MongoClient.connect('mongodb://127.0.0.1:27017/test6', 
    function(err, db) {  
      var metaData = db.collection('metadata');
      
      metaData.find({processed: false}).toArray(function(err, documents) {
        documents.forEach(function(value){
          results.push({url: value.git_url, id: value.id});
        })
      
      callback(results.slice(0,5));
      });
  });
}