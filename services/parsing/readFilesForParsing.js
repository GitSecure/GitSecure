var spawn = require('child_process').spawn;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');
var async = require('async');

var APIKeys = {
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
  }
};

var APIRegexes = {
  // twitter: /a/,
  // yelp: /a/,
  stripe: /(pk|sk)_live_\w{24}/,
  google: /AIza.{35}/,
  ebay: /api1.ebay.com/,
  paypal: /us_api1.paypal.com'/,
  test: /var/
};

var removeFile = function(path, callback) {
  fs.unlink(path, function (err) {
    if (err) {
      throw err;
    }
    else {
      console.log('successfully deleted ', path);
      callback();
    }
  });
};

var removeDirectory = module.exports.removeDirectory = function(path, callback) {
  fs.readdir(path, function(err, files) {
    if( err ) {
      callback(err, []);
      return;
    }
    var wait = files.length;
    var count = 0;

    var folderDone = function(err) {
      count++;
      if( count >= wait || err) {
        fs.rmdir(path, callback);
      }
    };

    // Empty directory to bail early
    if( !wait ) {
      folderDone();
      callback();
      return;
    }
    
    // Remove one or more trailing slash to keep from doubling up
    path = path.replace(/\/+$/,"");
    files.forEach(function(file) {
      var curPath = path + "/" + file;
      fs.lstat(curPath, function(err, stats) {
        if( err ) {
          callback(err, []);
          return;
        }
        if( stats.isDirectory() ) {
          removeDirectory(curPath, folderDone);
        } else {
          fs.unlink(curPath, folderDone);
        }
      });
    });
  });
};

var decorateHitData = function(obj, result, pathName, regex) { //decorator function for regex results
  obj.index = result.index;
  obj.match = result[0];
  obj.gitId = pathName.match(/[0-9]+/)[0];
  obj.key_type = regex;
  return obj;
};

var storeHitData = function(data) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect('mongodb://127.0.0.1:27017/test7', function(err, db) {
    var hitData = db.collection('hitdata');
    hitData.insert(data, function(err, result) {
      console.log("HitData Persisted: " + result);
    });
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
  removeDirectory(pathName, function() {
    callback();
  });
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
  var localBashPath = './services/parsing/concatDirectories.sh';
  var absoluteBashPath = '/Users/anthonyzotti/GitSecure/services/parsing/concatDirectories.sh';

  var localCWD = './git_data' + pathName + '/';
  var absoluteCWD = '/Users/anthonyzotti/GitSecure/git_data/' + pathName + '/';

  var bash = spawn('sh', [ localBashPath ], {
    cwd: localCWD,
    env: './'
  });


  var path = './git_data/' + pathName;
  bash.on('close', function(code){
    getTextFile(path + '/concatenatedDirectory.txt', function(text) { //async file read
      processFile(text, path, function() {
        callback();
      });
    });
  });
};

// var parseFile = module.exports.parseFile = function(directoryList, callback) {
//   async.eachSeries(directoryList, function(directoryName, itemCallback) {
//     var path = directoryName;
//     concatDirectory(path, function() {
//       itemCallback();
//     });
//   }, function() {
//     callback();
//   });
// };
//
var parseFile = module.exports.parseFile = function(directoryList, finalCallback) {
  var currentDirectory;
  var queueNextDirectory = function() {
    if (directoryList.length !== 0) {
      currentDirectory = directoryList.pop();
      processNextDirectory();
    } else {
      finalCallback();
    }
  };

  var processNextDirectory = function() {
    concatDirectory(currentDirectory, function() {
      eventEmitter.emit('completeDirectoryProcessing');
    });
  }

  eventEmitter.on('completeDirectoryProcessing', queueNextDirectory);
  queueNextDirectory();
}
