"use strict";
var https = require('https');
var querystring = require('querystring');
var secrets = require('./getSecrets.js');

module.exports = function(on_success, on_failure){

  if (on_failure === undefined)
    on_failure = on_success;

  var options = {
    host: 'datamarket.accesscontrol.windows.net',
    port: 443,
    path: '/v2/OAuth2-13',
    method: "POST"
  };

  var post_req = https.request(options, function(ms_response){
    ms_response.on('data', function(chunk){
      on_success(chunk.toString());
    });
    ms_response.on('error', function(e){
      on_failure("Got error: " + e.message);
    }); 
  }).on("error", function(e){
    on_failure("Got error: " + e.message);
  });

  var post_data = querystring.stringify({
      'client_id': secrets.getSecret('client_id'),
      'client_secret': secrets.getSecret('client_secret'),
      'scope': 'http://api.microsofttranslator.com/',
      'grant_type': 'client_credentials'
  });
  post_req.write(post_data);
  post_req.end();
};
