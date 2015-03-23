var spawn = require('child_process').spawn;
var fs = require('fs');
var async = require('async');
var fileSystemUtilities = require('./../fileSystem/utilities');

var APIKeys = {
  yahoo: {
    YAHOO_APP_ID: "Fy1D6WzV34GsyEey_xIofNOCy_yB3Z.mj5g0W3lOZwGmZu67EhFpCaMjkfk9Xg--",
    YAHOO_KEY: "dj0yJmk9eFJ5bU5aM3VydFBwJmQ9WVdrOU9WRTFPRUZzTlRnbWNHbzlOell3TXprM09UWXkmcz1jb25zdW1lcnNlY3JldCZ4PTRi"
  },
  bing: {
    BING_KEY : 'A84CD76D3C77083636BA7467897101D66D4BF831',
    BING_KEY : '0YD0LJBdtdzwVxoCkja4ggjGpUl/1LAWT8PELL2Dkcs'
  },
  facebook: {
    key:'350259761745772',
    secret:'23156e3c1874f75f8871ba6ea872db03'
  },
  twitter: {
    consumerKey: 'XZY3ZAyRzem613wcfFsCWqnA3',
    consumerSecret: '03CGds3Q0GCMSSLp3BjVo1zGEe0BS3zoabmh1NFTm3MCRlPvve',
    owner: 'jjnewman10',
    ownerID: 207420538,
    accessLevel: 'Read-only'
  },
  stripe: {
    sk_live: 'sk_live_FgV3tzZsHXbpDHn1tXeNxxxx',
    p_live: 'pk_live_IDwbcPLP8Ike8ieTYrmpxxxx'
  },
  google: {
    GOOGLEKEY : 'AIzaSyDRhpkQmqUbkJQpW73P_JkZK5kqNOYqjps',
    G_PLACES_KEY: 'AIzaSyDRhpkQmqUbkJQpW73P_JkZK5kqNOYqjps'
  },
  ebay: {
    username: 'krich_api1.ebay.com',
    password: ''
  },
  paypal: {
    username: 'schandrasekaran-us_api1.paypal.com',
    password: '44K8KBKHSKUQE6JK8'
  },
  azure: {
    mongoDB: 'AfKnZYWmF4q.r.Qj2YUl2OFgCfgab0wCfwV2VggD6e0-@ds050077.mongolab.com:50077/deploy-shortlyDB'
  },
  yelp: {
    api: 'http://api.yelp.com/business_review_search?',
    key: 'ftPpQUCgfSA3yV98-uJn9g'
  }
};

var APIRegexes = {
  // twitter: /a/,
  yelpAPI: /http:\/\/api.yelp.com\/business_review_search?/,
  yelpKey: /\w{16}-[a-zA-Z1-9]{5}/,
  stripe: /(pk|sk)_live_\w{24}/,
  google: /AIza.{35}/,
  ebay: /api1.ebay.com/,
  paypal: /us_api1.paypal.com/,
  azureMongo: /-@\w{2}\d{6}\.mongolab\.com:\d{5}/,
  test: /var/
};

var decorateHitData = function(obj, result, pathName, regex) {
  obj.index = result.index;
  obj.match = result[0];
  obj.gitId = pathName.match(/[0-9]+/)[0];
  obj.key_type = regex;
  return obj;
};

var storeHitData = function(data) {
  var hitData = GLOBAL.db.collection('hitdata');
  hitData.insert(data, function(err, result) {
    console.log("HitData Persisted: " + result);
  });
};

var findAPIKey = function(regex, text) {
  return regex.exec(text);
};

var processFile = function(text, pathName, callback) {
  for( var regex in APIRegexes ) {
    var result = findAPIKey(APIRegexes[regex], text );
      if (result) {
        var APIData = {};
        decorateHitData(APIData, result, pathName, regex);
        storeHitData(APIData);
      }
  }
  callback();
  fileSystemUtilities.removeDirectoryAsync(pathName);
};

var getTextFile = function(path, callback) {
  var content;
  fs.readFile(path, 'utf8',function (err, data) {
      if (err) {
          throw err;
      }
      content = data;
      callback(content);
  });
};

var concatDirectory = function(pathName, callback) {
  var path = __dirname + '/git_data/' + pathName;
  var dirNamePath = __dirname + '/concatDirectories.sh';
  var dirCWD = __dirname + '/git_data/' + pathName +'/';
  var bash = spawn('sh', [ dirNamePath ], {
    cwd: dirCWD,
    env: './'
  });

  bash.on('close', function(code){
    getTextFile(path + '/concatenatedDirectory.txt', function(text) {
      processFile(text, path, function() {
        callback();
      });
    });
  });
};

 var parseFile = module.exports.parseFile = function(directoryList, callback) {
   async.eachSeries(directoryList, function(directoryName, itemCallback) {
     var path = directoryName;
     concatDirectory(path, function() {
       itemCallback();
     });
   }, function() {
     callback();
   });
 };

