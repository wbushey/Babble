var fs = require('fs');
var https = require('https');
var querystring = require('querystring');
var secret = require('./secret.js');

exports.get = function(request, response){
  response.setHeader("Content-Type", "application/json");

  var options = {
    host: 'datamarket.accesscontrol.windows.net',
    port: 443,
    path: '/v2/OAuth2-13',
    method: "POST"
  };

  var post_req = https.request(options, function(ms_response){
    ms_response.on('data', function(chunk){
      console.log(chunk.toString());
      response.end(chunk.toString());
    });
    ms_response.on('error', function(e){
      console.log("Got error: " + e.message);
      response.end("Got error: " + e.message);
    }); 
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    response.end("Got error: " + e.message);
  });
  console.log("Post_req created");
  var post_data = querystring.stringify({
      'client_id': secret.client_id,
      'client_secret': secret.client_secret,
      'scope': 'http://api.microsofttranslator.com/',
      'grant_type': 'client_credentials'
  });
  post_req.write(post_data);
  post_req.end();
};

