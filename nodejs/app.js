// Load the http module
var http = require('http');
var Router = require('node-simple-router');
var fs = require('fs');

// Configure the Router
var router = new Router({static_route: __dirname + "/assets"});

// Services
router.get("/", 
   require('./home').get);

router.get("/requestTranslateToken", 
  require('./requestTranslateToken').get);

router.get("/translateText", 
  require('./translateText').get);

router.get("/translateAudio", 
  require('./translateAudio').get);

// Configure the HTTP server
var server = http.createServer(router);

server.listen(80);

// Tell the console we're running a server
console.log("Node running");
