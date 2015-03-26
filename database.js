'use strict';

var uri = process.env.DBURI || '127.0.0.1:27017/development';
var db = require('monk')(uri);

module.exports = db;
