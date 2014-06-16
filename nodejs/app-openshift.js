// Load the http module
var http = require("http");
var Router = require("node-simple-router");
var fs = require("fs");

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;


// Configure the Router
var router = new Router({static_route: __dirname + "/assets"});

// Services
router.get("/", 
   require("./routes/home").get);

router.get("/requestTranslateToken", 
  require("./routes/requestTranslateToken").get);

router.get("/translateText", 
  require("./routes/translateText").get);

router.get("/translateAudio", 
  require("./routes/translateAudio").get);

router.get("/chat", require("./routes/chat"));


// Configure the HTTP server
var server = http.createServer(router);
var room = require("./routes/translationRoom").create(server);

server.listen(port, ipaddr);

// Tell the console we"re running a server
console.log("Node running");
