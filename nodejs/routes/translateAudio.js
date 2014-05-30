"use strict";
var http = require("http");
var querystring = require("querystring");

exports.get = function(request, response){
  response.setHeader("Content-Type", "audio/mpeg");

  var options = {
    host: 'api.microsofttranslator.com',
    port: 80,
    path: '/V2/Http.svc/Speak?language=' + request.get.to + '&text=' + encodeURIComponent(request.get.text) + '&format=audio%2Fmp3&options=MaxQuality',
    method: "GET"
  };

  var post_req = http.request(options, function(external_response){
    external_response.on('data', function(chunk){
      console.log(chunk);
      response.write(chunk);
    });
    external_response.on('end', function(chunk){
      response.end();
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
