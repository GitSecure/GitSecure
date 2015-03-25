// This script is for using scanjs server side adapted from //github.com/mozilla/scanjs
'use strict';
var fs = require('fs');
var path = require('path');
var beautify = require('../../../node_modules/scanjs/node_modules/js-beautify').js_beautify;
var parser = require('../../../node_modules/scanjs/client/js/lib/acorn.js');
var ScanJS = require('../../../node_modules/scanjs/common/scan');

// rules for scanjs checking
var signatures = JSON.parse(fs.readFileSync(__dirname + "/rules.json", "utf8"));

// recursive function for finding all files in a directory
var dive = function(dir, action) {
  if( typeof action !== 'function') {
    action = function(error, file) {
      console.log(">" + file)
    };
  }
  list = fs.readdirSync(dir);
  list.forEach(function(file) {
    var fullpath = dir + '/' + file;
    try {
      var stat = fs.statSync(fullpath);
    } catch(e) {
      console.log("SKIPPING FILE: Could not stat " + fullpath);
    }
    if(stat && stat.isDirectory()) {
      dive(fullpath, action);
    } else {
      action(file, fullpath);
    }
  });
};

// actual scanning function, returns an object of results, one for each file that had a non-zero # of errors
var scanDir = function(dir) {
  var results = {};

  ScanJS.parser(parser);
  ScanJS.loadRules(signatures);
  
  dive(dir, function(file, fullpath) {
    var ext = path.extname(file.toString());

    if(ext === '.js') {
      var content = fs.readFileSync(fullpath, 'utf8');
      //beautify source so result snippet is meaningful
      var content = beautify(content, { indent_size: 2 });

      var ast = parser.parse(content, { locations: true });

      var scanresult = ScanJS.scan(ast, fullpath);
      // console.log('scanresults: ', scanresult);
      if (scanresult.type === 'error') {
        console.log("SKIPPING FILE: Error in "+ fullpath+", at Line "+ scanresult.error.loc.line +", Column "+scanresult.error.loc.column+ ": " + scanresult.error.message);
      }
      results[fullpath] = scanresult;
    }
  });
  // Flatten results to remove files with no findings and tests with no results (i.e. empty arr)
  // TODO: Don't even store empty unless --overly-verbose or so..
  for (var testedFile in results) {
    for (var testCase in results[testedFile]) {
      if (results[testedFile][testCase].length === 0) {
        delete(results[testedFile][testCase]);
      }
    }
    if (Object.keys(results[testedFile]).length === 0) {
      delete(results[testedFile]);
    }
  }
  console.log('scan completed successfully...');
  return results;
};

// exporting the scanning function so it can be used w/ require
exports.scanDir = scanDir;
