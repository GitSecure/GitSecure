'use strict';

var mandrill = require('mandrill-api/mandrill');
exports.mandrill_client = new mandrill.Mandrill('Insert API key here');
