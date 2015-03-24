var mandrillAPI = require('./mandrillapi.js')

exports.sendMessage = function(data) {
  var email = '';
  var message = {
    "html": "<p>" + data.fullname + ",</p>\
    <p>Just want to let you know we found a publically listed API key on your github repo that is perhaps dangerous.</p>\
    <p>This is the potentially dangerous repo we found: <a href='" + data.repo + "'>" + data.repo +"</a></p>\
    <p>We are not looking for money -- we are a team of engineers that are trying to make the web a bit of a safer place.\
    <p>All the best, \
    <br>\
    The GitSecure Team\
    <br>\
    <a href ='http://www.gitsecure.io'>http://www.gitsecure.io</a></p>",
    "subject": data.username + ", you posted an API key on GitHub!",
    "from_email": "gitsecurenow@gmail.com",
    "from_name": "GitSecure Team",
    "to": [{
            "email": email, //data.email
            "name": data.fullname,
            "type": "to"
        }],
    "headers": {
        "Reply-To": "gitsecurenow@gmail.com"
    }
  };

  var async = false;

  mandrillAPI.mandrill_client.messages.send({"message": message, "async": async}, function(result) {
      console.log("email sent");
      console.log(result);
  }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  });
}