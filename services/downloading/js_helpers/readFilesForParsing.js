var spawn = require('child_process').spawn;

var deploySh = spawn('sh', [ 'concatGit.sh' ], {
  cwd: './',
  env: './'
});

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
  }
};

var APIRegexes = {
  twitter: /a/,
  yelp: /a/
};

var fileParser = function() {

};

