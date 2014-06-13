"use strict";
var fs = require('fs');

module.exports = function(request, response){
  response.writeHead(200, {'Content-Type': 'text/html' });
  response.end(fs.readFileSync('chat.html'));
};
