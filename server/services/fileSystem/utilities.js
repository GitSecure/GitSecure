'use strict';
var rimraf = require('rimraf');

var removeDirectorySync = module.exports.removeDirectorySync = function(path) {
  rimraf.sync(path);
};

var removeDirectoryAsync = module.exports.removeDirectoryAsync = function(path, callback) {
  rimraf(path, function() {
    console.log('Directory ' + path + ' removed');
  });
  if (callback) {
    callback();
  }
};

exports.removeDirectorySync = removeDirectorySync;
exports.removeDirectoryAsync = removeDirectoryAsync;
