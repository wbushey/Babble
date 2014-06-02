/** 
 * @module Clients 
 * @namespace 
 **/

/**
 * @constructor
 * @alias module:Clients
 * @extends Array
 * @classdesc Represents all of the clients in a room, with a convience method
 *            for broadcasting a translated message to all of them.
 */
var Clients = function(){
  // Instance Variables
  this._name = "";
}

Clients.prototype = new Array();

/**
 * Access and modify the Client List's name. If called without an argument, it
 * will return the Client List's current name. If called with an argument, it
 * will set the Client List's name to the provided string, and return the newly
 * set name.
 *
 * @method name
 * @param {String} new_name A string to set the Client List's name to
 * @throws {Error} If new_name is provided, it must be a string
 * @returns {String} The Client List's name
 */
Clients.prototype.name = function(new_name){

}
 
/**
 * Translates the provided message and sends the translation, in appropriate
 * media, to all clients in the list.
 *
 * If ignore_clients is provided, than the provided message will not be
 * translated and emitted to any Client objects in the Clients list that are
 * also in the ignore_clients list.
 *
 * If output_media is provided, it will determine which media to translate to
 * and broadcast. Otherwise, the output_media properties of clients in the 
 * list will be used to determine which media to output to each client.
 *
 * Refer to Client#emit for notes on available output_media and their
 * associated behaviors.
 *
 * @method broadcast 
 * @param {String} msg The string to translate and broadcast
 * @param {String} from_lang Language code for the language that msg is 
 *                           currently in
 * @param {Client[]} ignore_clients List of Client objects to not emit a 
 *                                  broadcast to
 * @param {String[]} [output_media] If provided, this will override the 
 *                                  output_media of the clients for this
 *                                  broadcast
 */
Clients.prototype.broadcast = function(params){

}

module.exports = Clients
