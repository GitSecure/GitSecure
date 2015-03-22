var mkdirp = require('mkdirp');
var clone = require("nodegit").Clone.clone;
var mainApp = require('../../../app.js');
var async = require('async');

exports.readListOfFiles = function(urlList, callback) {
  var directoryList = [];

  async.eachSeries(urlList, function(urlObj, itemCallback) {
    mkdirp("git_data/" + urlObj.id.toString(), function(err){
    });
    clone(urlObj.git_url, "git_data/" + urlObj.id.toString()).then(function(repo){
      directoryList.push(urlObj.id.toString());
      itemCallback();
    });
  }, function() {
    console.log('in the final callback for each');
    callback(directoryList);
  });

};

// exports.readListOfFiles = function(urlList, callback){
//   var x = 0;
//   var directoryList = [];
//   var strId = [];
//   var checkInterval = function(){
//     console.log('github repograbber', x, urlList.length)
//       if(x === urlList.length - 1){
//         console.log("sending data", directoryList);
//         callback(directoryList);
//         clearInterval(checkLengthLoop);
//       }
//   }

//   var checkLengthLoop = setInterval(checkInterval, 1000);

//   var onCompletion = function(){
//     for(var i = 0; i < urlList.length; i++){
//       strId[i] = urlList[i].id.toString();
//       mkdirp("git_data/" + strId[i], function(err){
//       })
//       clone(urlList[i].git_url, "git_data/" + strId[i]).then(function(repo){
//         directoryList.push(strId[x]);
//         console.log("DLIST: " + directoryList);
//         x++;
//       })
//     }
//   }

//   onCompletion();
// }


//setInterval(function,1000)

// will look to see if x === urlList.length
//clear interval
//run callback
