/**
 * Requests that the Microsoft translation service translate the provided
 * message into the requested language and medium. This function handles
 * authenticating with the Microsoft translation service, making the request
 * for translation, and receiving the results of translation.
 *
 * When using the "text" output medium, this function will return the
 * translation as a string containing the actual translation.
 * When using the "audio" output medium, this function will return the URL to
 * an audio stream of the translation.
 *
 * @param msg {String} A string to get a translation of
 * @param from_lang {String} Language code of the language that msg is currently in
 * @param to_lang {String} Language code of the language to translate in to
 * @param medium {String} "text" or "audio", determines which of these media to translate to
 * @returns {String} Either the text of the translation, or a URL to the audio of the translation,
 *                   depending on the value of medium
 */
exports.fetchTranslation = function(params){
  return 0;
};
