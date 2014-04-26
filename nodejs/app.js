// Load the http module
var http = require('http');

// Configure the HTTP server
var server = http.createServer(function (request, response){
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});

server.listen(8888);

// Tell the console we're running a server
console.log("Node running");
