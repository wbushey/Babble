"use strict";
var querystring = require("querystring");
var http = require("http");

exports.get = function(request, response){

  var options = {
    host: 'api.microsofttranslator.com',
    port: 80,
    path: '/V2/Http.svc/Translate?to=' + request.get.to + '&from=' + request.get.from + '&text=' + encodeURIComponent(request.get.text),
    method: "GET"
  };

  var post_req = http.request(options, function(external_response){
    external_response.on('data', function(chunk){
      console.log(chunk.toString());
      response.end(chunk.toString());
    });
    external_response.on('error', function(e){
      console.log("Got error: " + e.message);
      response.end("Got error: " + e.message);
    }); 
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    response.end("Got error: " + e.message);
  });
  var post_data = querystring.stringify({
      //'appId': "Bearer " + request.post.appId,
      'text': request.get.text,
      'from': request.get.from,
      'to': encodeURIComponent(request.get.to),
      'contentType': "text/plain"
  });
  console.log("Post_data created");
  console.log(post_data);
  post_req.setHeader('Authorization', "Bearer " + request.get.appId);
  post_req.write(post_data);
  console.log('post_req = ');;
  console.log(post_req);
  post_req.end();
};
