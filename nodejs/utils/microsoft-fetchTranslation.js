var fetchToken = require('./microsoft-fetchTranslationToken');

/**
 * Requests that the Microsoft translation service translate the provided
 * message into the requested language and medium. This function handles
 * authenticating with the Microsoft translation service, making the request
 * for translation, and receiving the results of translation.
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
 * @param on_success {OnSuccess} Called upon successful completeion of fetching the translation
 * @param on_failure {OnFailure} Called when a failure is encountered
 */
exports.fetchTranslation = function(params, on_success, on_failure){
  if on_failure === undefined
    on_failure = on_success;

  fetchToken(function(data){
  
  }, on_failure);
};

/**
 * @callback OnSuccess
 * @param {String} The result of fetchTranslation
 */

/**
 * @callback OnFailure
 * @param {String} The result of fetchTranslation
 */
