"use strict";
var fetchTranslateToken = require('../utils/microsoft-fetchTranslationToken');


exports.get = function(request, response){
  // Using the same callback for success and failure
  var on_completion = function(data){
    console.log(data);
    response.end(data);
  };

  response.setHeader("Content-Type", "application/json");
  fetchTranslateToken(on_completion);
};
