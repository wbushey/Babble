var fs = require('fs');

exports.get = function(request, response){
  response.end(fs.readFileSync('index.html'));
};

