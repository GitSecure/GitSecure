'use strict';

var db = require('../../database.js');

exports.query = function(repoID, callback){  
  // gets users docs from the database (which is populated by the front end)
  function getReposDocuments() {
    var Repos = db.get('Repos');
    // gets first record that hasn't been processed, ordered by their unique mongo ID
    // set the processed value to true ({repo_id: 11667865} pass this to find to get a specific document)
    var consoleData = Repos.findOne({repo_id: repoID}).on('complete', function(err, doc) {
      if (err) {
        console.log('error, no db record with this repo_id: ', repoID);
        console.log(err);
      } else {
        // once we get it (array of Repo documents) pass it along
        console.log('findOne doc: ', doc);
        callback(doc)
      }
    });
  }

  // start the querying process
  getReposDocuments();
};
