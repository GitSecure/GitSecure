var spawn = require('child_process').spawn;


var deploySh = spawn('sh', [ 'concatDirectories.sh' ], {
  cwd: '../downloading/git_data',
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
  twitter: /a/,
  yelp: /a/,
  stripe: /(pk|sk)_live_\w{24}/,
  google: /AIza.{35}/,
  ebay: /api1.ebay.com/,
  paypal: /us_api1.paypal.com'/
};

var fileParser = function() {
  //read in concatenatedDirectoriest.txt file
  getTextFile('./concatenatedDirectory.txt', function(text) { //async file read
    processFile(text);
  });
};

var organizeHitData = function(obj, regex, index, match) { //decorator function for regex results
  obj.regex = regex;
  obj.index = index;
  obj.match = match;
  return obj;
};

var storeHitData = function(data) {
  //store back in MongoDB
};

var processFile = function(text) {
    var stripeRegex = APIRegexes[stripe];
    var googleRegex = APIRegexes[google];

    var stripeHit = stripeRegex.exec(text); //note exec method returns the whole input string
    var googleHit = googleRegex.exec(text);


    if ( googleHit ) {
      var googleAPIData = {};
      organizeHitData(googleAPIData); //store regex used, service name, matched text, index
      storeHitData(googleAPIData);
    }

  else { //remove file from DB
    removeFile('./concatenatedDirectory.txt', function() {
       console.log('successfully deleted file');
    });
    //delete file
    //delete directory
  }
};

