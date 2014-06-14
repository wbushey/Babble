"use strict";
var fetchTranslation = require('../utils/microsoft-fetchTranslation');

exports.get = function(request, response){
  response.setHeader("Content-Type", "audio/mpeg");

  // Callbacks for the various request states
  var on_data = function(chunk){
    response.write(chunk);
  };
  var on_end = function(chunk){
    response.end(chunk);
  };
  var on_error = function(e){
    console.log("Got error: " + e.message);
    response.write("Got error: " + e.message);
    response.end();
  };

  var fetch_options = {
    msg: request.get.text,
    to_lang: request.get.to,
    medium: "audio",
    auth_token: request.get.appId,
    on_data: on_data,
    on_error: on_error,
    on_end: on_end
  };
  fetchTranslation(fetch_options);
};
