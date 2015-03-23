exports.query = function(callback){
  var results = [];
  function getMetaDataDocument() {
    var metaData = GLOBAL.db.collection('metadata');
    metaData.findAndModify({processed: false}, [['_id','asc']], {$set: {processed: true}}, function(err, doc) {
      results.push({ git_url: doc.git_url, id: doc.id});
      handleMetaData();
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
