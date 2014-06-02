var fetchToken = require('./microsoft-fetchTranslationToken');
var querystring = require('querystring');
var http = require('http');

// Documentation on using the Microsoft Translate service:
// http://msdn.microsoft.com/en-us/library/ff512406.aspx

// Documentation on using the Microsoft Speak service:
// http://msdn.microsoft.com/en-us/library/ff512405.aspx

/**
 * Requests that the Microsoft translation service translate the provided
 * message into the requested language and medium. This function handles
 * authenticating with the Microsoft translation service (if no token is 
 * provided), making the request for translation, and receiving the results 
 * of translation.
 *
 * When using the "text" output medium, this function will pass to the callback
 * the translation as a string containing the actual translation.
 * When using the "audio" output medium, this function will pass to the 
 * callback the URL to an audio stream of the translation.
 *
 * @param msg {String} A string to get a translation of
 * @param from_lang {String} Language code of the language that msg is currently in
 * @param to_lang {String} Language code of the language to translate in to
 * @param medium {String} "text" or "audio", determines which of these media to translate to
 * @param auth_token {String} The authorization token from Microsoft for the request.
 *                            If provided, this will be used for authenticating in lieu
 *                            of requesting another token.
 * @param on_success {OnData} Called when data for from the translation service is available
 * @param on_error {OnError} Called when an error is encountered
 * @param on_end {OnEnd} Called when the response from the translation service has finished
 */
module.exports = function(params){
  
  // Set the state for using or fetching the auth_token
  var auth_token = params.hasOwnProperty('auth_token') ? params.auth_token: "";
  var update_auth_token = function(chunk){
    auth_token += chunk.toString();
  };

  // Create a nested function to use as a callback if needed
  var _fetchTranslation = function(){

    // Handle media choice
    var path_root = null;
    if (params.medium === 'text')
      path = '/V2/Http.svc/Translate?to=' + params.to_lang + '&from=' + params.from_lang + '&text=' + encodeURIComponent(params.msg);
    else if (params.medium === 'audio')
      path = '/V2/Http.svc/Speak?language=' + params.to_lang + '&text=' + encodeURIComponent(params.msg) + '&format=audio%2Fmp3&options=MaxQuality'
    else
      throw "Unsupported Medium Requested: " + params.medium

    // Prepare the fetch request
    var options = {
      host: 'api.microsofttranslator.com',
      port: 80,
      path: path,
      method: "GET"
    };
    var post_req = http.request(options, function(ms_response){
      ms_response.on('data', params.on_data);
      ms_response.on('end', params.on_end);
      ms_response.on('error', params.on_error); 
    }).on("error", params.on_end);
  
    // Send the request
    post_req.setHeader('Authorization', "Bearer " + auth_token);
    post_req.end();
  };


  // Get a token if there isn't already one
  if (auth_token){
    _fetchTranslation();
  } else {
    var fetch_options = {
      on_data: update_auth_token,
      on_end: _fetchTranslation,
      on_error: params.on_error
    };
    fetchToken(fetch_options);
  }

};

/**
 * @callback OnData
 * @param {String} Data from fetchTranslation
 */

/**
 * @callback OnError
 * @param {String} An error message that is encountred 
 */

/**
 * @callback OnEnd
 * @param {String} Honestly don't know
 */
