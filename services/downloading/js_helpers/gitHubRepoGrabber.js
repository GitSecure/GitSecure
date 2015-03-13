var mkdirp = require('mkdirp');
var clone = require("nodegit").Clone.clone;

exports.readListofFiles = function(list, id){
  var strId = id.toString();
  mkdirp("git_data/" + strId, function(err){
  })
  clone(list, "git_data/" + strId);
}
