exports.query = function(callback){
  var results = [];
  function getMetaDataDocument() {
    var metaData = GLOBAL.db.collection('metadata');
    metaData.findAndModify({processed: false}, [['_id','asc']], {$set: {processed: true}}, function(err, doc) {
      results.push({ git_url: doc.git_url, id: doc.id});
      handleMetaData();
  });
}

  var updateCount = function() {
    var count = GLOBAL.db.collection('count');
      count.update({"count": {$exists: true}}, {$inc : {count: 1 }}, function(err, modified, status) {
        if (err) {console.log(err,'here')};
      });
  };

  function handleMetaData() {
    if (results.length < 2) {
      updateCount();
      getMetaDataDocument();
    } else {
      updateCount();
      callback(results);
   }
  }
  getMetaDataDocument();
}
