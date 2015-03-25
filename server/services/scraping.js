'use strict';

var db = require('../../database.js');

exports.scrapeUrls = function(callback){
  var request = require('request');
  var options = {};
  var dateString = new Date(Date.now() - 28000).toISOString();

  options.url = 'https://api.github.com/search/repositories?q=pushed:>=' + 
    dateString + 
    '&order=desc&per_page=100';
  options.headers = {'User-Agent': 'request'};

  var metaData = db.get('metadata');
  request(options, function(err, res, body) {
    if (err) {
      console.log(err);
    }
    console.log('Downloading most recent GitHub repo urls');
    var data = JSON.parse(body).items;

    for (var i = 0; i < data.length - 1; i++) { // Why the -1?
      data[i].processed = false;
      metaData.insert(data[i]);
    }
    callback();
  });
};
