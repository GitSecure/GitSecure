exports.query = function(callback){
  var MongoClient = require('mongodb').MongoClient;
  var results = [];
  function getMetaDataDocument() {
    var db = MongoClient.connect('mongodb://127.0.0.1:27017/test8', function(err, db) {  
      var metaData = db.collection('metadata');
      metaData.findAndModify({processed: false}, [['_id','asc']], {$set: {processed: true}}, function(err, doc) {
        results.push({ git_url: doc.git_url, id: doc.id});
        handleMetaData();
      });
    });
  }

  function handleMetaData() {
    if (results.length < 2)
      getMetaDataDocument();
    else
     callback(results);
  }
  getMetaDataDocument();
}
