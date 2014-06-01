/** 
 * @module Client 
 * @namespace 
 **/

/**
 * @constructor
 * @alias module:Client
 * @classdesc Represents a user connected to the server and makes it easy to
 *            to translate messages to and from the user.
 */
var Client = function(){
  // Instance Variables
  this._name = "";
  this._from_lang = "";
  this._to_lang = "";
  this._output_media = [];
  this._socket = null;
}

/**
 * Access and modify the Client's name. If called without an argument, it will
 * return the Client's current name. If called with an argument, it will set
 * the Client's name to the provided string, and return the newly set name.
 *
 * @method name
 * @param {String} new_name A string to set the Client's name to
 * @throws {Error} If new_name is provided, it must be a string
 * @returns {String} The Client's name
 */
Client.prototype.name = function(new_name){

}

/**
 * Access and modify the Client's language to translate from. If called without
 * an argument, it will return the Client's current language to translate from.
 * If called with an argument, it will set the Client's language to translate 
 * from to the provided string, and return the newly set language to translate
 * from.
 *
 * @method from_lang
 * @param {String} new_from_lang A string representing the language to 
 *                               translate from for the client
 * @throws {Error} If new_from_lang is provided, it must be a string
 * @returns {String} The Client's language to translate from
 */
Client.prototype.from_lang = function(new_from_lang){

}

/**
 * Access and modify the Client's language to translate to. If called without
 * an argument, it will return the Client's current language to translate to.
 * If called with an argument, it will set the Client's language to translate 
 * to to the provided string, and return the newly set language to translate to.
 *
 * @method to_lang
 * @param {String} new_to_lang A string representing the language to translate 
                               to for the client
 * @throws {Error} If new_to_lang is provided, it must be a string
 * @returns {String} The Client's language to translate to
 */
Client.prototype.to_lang = function(new_to_lang){

}



/**
 * Access and modify the Client's media to output to. If called without an 
 * argument, it will return an array of the Client's current media to 
 * output to. If called with an argument, it will set the Client's media to
 * output to based on the provided argument, and return the newly set media
 * to output to.
 *
 * output_media must be set to an array. Only the following values are allowed:
 * "text", "audio".
 *
 * @method output_media 
 * @param {String[]} new_output_media An array of strings representing the 
                               media to translate to for the client
 * @throws {Error} If new_output_media is provided, it must be an array of 
                   strings with only the allowed values.
 * @returns {String[]} The Client's media to output
 */
Client.prototype.output_media = function(new_output_media){

}

/**
 * Access and modify the Client's socket. If called without an argument, it
 * will return the Client's current socket. If called with an argument, it will
 * set the Client's socket to the provided Socket, and return the newly set
 * socket.
 *
 * @method socket
 * @param {Socket} new_socket A Socket to set the Client's socket to
 * @throws {Error} If new_socket is provided, it must be a Socket.io Socket
 * @returns {Socket} The Client's socket
 */
Client.prototype.socket = function(new_socket){

}

/**
 * Translates the provided message and sends the translation, in appropriate
 * media, to the client. If output_media is provided, it will determine which
 * media to translate to and emit. Otherwise, the Client's output_media 
 * property will be used to determine which media to output to.
 *
 * What actually is emitted various between the output media.
 * When using the "text" output medium, translations will be emitted as a
 * string containing the actual translation.
 * When using the "audio" output medium, translations will be emitted as a
 * URL to an audio stream of the translation.
 *
 * @method emit
 * @param {String} msg The string to translate
 * @param {String} from_lang Language code for the language that msg is 
 *                           currently in
 * @param {String[]} [output_media] If provided, this will override the 
 *                                  output_media of the client for this emission
 * @throws {Error} If socket is not already set
 */
Client.prototype.emit = function(msg, from_lang, output_media){

// At some point this should call fetchTranslation from ../utils/*-fetchTranslation
}

module.exports = Client
