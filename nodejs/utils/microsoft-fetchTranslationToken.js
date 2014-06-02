"use strict";
var https = require('https');
var querystring = require('querystring');
var secrets = require('./getSecrets.js');

// Documentation on requesting a Microsoft Translate Token
// http://msdn.microsoft.com/en-us/library/hh454950.aspx

/**
 * @param on_data On Data callback
 * @param on_end Callback for end of response
 * @param on_error Error callback
 */
module.exports = function(params){

  var options = {
    host: 'datamarket.accesscontrol.windows.net',
    port: 443,
    path: '/v2/OAuth2-13',
    method: "POST"
  };

  var post_req = https.request(options, function(ms_response){
    ms_response.on('data', params.on_data);    
    ms_response.on('error', params.on_error);
    ms_response.on('end', params.on_end);
  }).on("error", params.on_error); 

  var post_data = querystring.stringify({
      'client_id': secrets.getSecret('client_id'),
      'client_secret': secrets.getSecret('client_secret'),
      'scope': 'http://api.microsofttranslator.com/',
      'grant_type': 'client_credentials'
  });
  post_req.write(post_data);
  post_req.end();
};
