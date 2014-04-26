// Load the http module
var http = require('http');
var Router = require('node-simple-router');

// Configure the Router
var router = new Router();
router.get("/", function(request, response){
  if ("name" in request.get){
    response.end("Hello " + request.get.name + "\n");
  } else {
    response.end("Hello World\n");
  }
});
router.get("/foo", function(request, response){
  response.end("Bar\n");
});


// Configure the HTTP server
var server = http.createServer(router);

server.listen(8888);

// Tell the console we're running a server
console.log("Node running");
