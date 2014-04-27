// Load the http module
var http = require('http');
var https = require('https');
var Router = require('node-simple-router');
var querystring = require('querystring');
var fs = require('fs');

// Configure the Router
var router = new Router();
router.get("/", function(request, response){
  response.end(fs.readFileSync('index.html'));
});
router.get("/mic-animate.gif", function(request, response){
  response.end(fs.readFileSync('pics/mic-animate.gif'));
});
router.get("/mic.gif", function(request, response){
  response.end(fs.readFileSync('pics/mic.gif'));
});
router.get("/mic-slash.gif", function(request, response){
  response.end(fs.readFileSync('pics/mic-slash.gif'));
});


router.get("/foo", function(request, response){
  response.end(request.url + "bar\n");
});




router.get("/requestTranslateToken", function(request, response){
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
      'client_id': 'redwingbabble',
      'client_secret': 'redhotsecretredhotsecret',
      'scope': 'http://api.microsofttranslator.com/',
      'grant_type': 'client_credentials'
  });
  post_req.write(post_data);
  post_req.end();
});


router.get("/translateText", function(request, response){
  response.setHeader("Content-Type", "application/json");

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

});

// Configure the HTTP server
var server = http.createServer(router);

server.listen(80);

// Tell the console we're running a server
console.log("Node running");
