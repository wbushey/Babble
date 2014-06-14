"use strict";
var fetchTranslation = require('../utils/microsoft-fetchTranslation');

exports.get = function(request, response){

  // Callbacks for the various request states 
  var on_data = function(chunk){
    response.write(chunk.toString());
  };
  var on_end = function(chunk){
    response.end(chunk);
  }
  var on_error = function(e){
    console.log("Got error: " + e.message);
    response.write("Got error: " + data);
    response.end();
  }

  var fetch_options = {
    msg: request.get.text,
    from_lang: request.get.from,
    to_lang: request.get.to,
    medium: "text",
    auth_token: request.get.appId,
    on_data: on_data,
    on_error: on_error,
    on_end: on_end
  };
  fetchTranslation(fetch_options);

};
