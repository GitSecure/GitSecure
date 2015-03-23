var rimraf = require('rimraf');


var removeDirectorySync = module.exports.removeDirectorySync = function(path) {
  rimraf.sync(path);
  return;
};

var removeDirectoryAsync = module.exports.removeDirectoryAsync = function(path, callback) {
  rimraf(path, function() {
    console.log('Directory ' + path + ' removed');
  });
};