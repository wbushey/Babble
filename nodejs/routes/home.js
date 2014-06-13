"use strict";
var fs = require('fs');

exports.get = function(request, response){
  response.writeHead(200, {'Content-Type': 'text/html' });
  response.end(fs.readFileSync('index.html'));
};
