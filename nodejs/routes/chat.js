"use strict";
var fs = require('fs');

module.exports = function(request, response){
  response.end(fs.readFileSync('chat.html'));
};
