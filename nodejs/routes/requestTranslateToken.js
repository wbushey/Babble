"use strict";
var fetchTranslateToken = require('../utils/microsoft-fetchTranslationToken');


exports.get = function(request, response){

  // Callbacks for the various request states
  var on_data = function(chunk){
    console.log(chunk.toString());
    response.end(chunk.toString());
  };
  var on_end = function(chunk){
    response.end();
  };
  var on_error = function(e){
    console.log("Got error: " + e.message);
    response.end("Got error: " + e.message);
    response.end();
  }

  var fetch_options = {
    on_data: on_data,
    on_end: on_end,
    on_error: on_error
  };

  response.setHeader("Content-Type", "application/json");
  fetchTranslateToken(fetch_options);
};
