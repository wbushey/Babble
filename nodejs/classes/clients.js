/** 
 * @module Clients 
 * @namespace 
 **/

/**
 * @constructor
 * @alias module:Clients
 * @classdesc Represents all of the clients in a room, with a convience method
 *            for broadcasting a translated message to all of them.
 */
var Clients = function(params){
  // Instance Variables
  this._name = "";
  this._clients = [];
  this._client_names = [];

  if (params !== undefined){
    this.name(params.name);
  }
}

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
  if (new_name !== undefined){
    this._name = new_name;
  }

  return this._name;
}

/**
 * Adds a new client to the room.
 *
 * @method insert
 * @param {Client} The Client to add
 */
Clients.prototype.insert = function(new_client){

  if (new_client === undefined)
    throw new Error("Attempting to add undefined to a Clients List");

  if (typeof new_client.emit !== 'function')
    throw new Error("Attempting to add a Client that does not have an emit method");

  if (this._client_names.indexOf(new_client.name()) !== -1){
    throw new Error("Client " + new_client.name() + " already in list.");
  }

  this._clients.push(new_client);
  this._client_names.push(new_client.name());

  return new_client;
}

/**
 * Removes a client from the room.
 *
 * @method remove
 * @param {Client} The Client to remove
 * @returns {Boolean} true if the Client was removed, false otherwise
 */
Clients.prototype.remove = function(leaving_client){
  var i = -1;
  if (typeof leaving_client.name === 'function'){
    i = this._clients.indexOf(leaving_client);
  } else if (typeof leaving_client === 'string'){
    i = this._client_names.indexOf(leaving_client);
  } else {
    throw new Error("Can only attempt to remove a Client or the name of a Client");
  }

  if (i === -1){
    return false;
  }

  delete this._clients[i];
  delete this._client_names[i];
  return true;
}

/**
 * Checks whether the provided Client(s) are in the room. Can either check for
 * a single Client, or an Array of Client objects.
 *
 * @method contains
 * @param {Client or Client[]} Client or Client objects to look for
 * @returns {Boolean} true if all provided Client objects are in the room, false otherwise
 */
Clients.prototype.contains = function(subset){
  if (typeof subset === 'string'){
    return (this._client_names.indexOf(subset) !== -1) ? true : false;
  } else if (typeof subset.name === 'function'){
    return (this._clients.indexOf(subset) !== -1) ? true : false;
  } else if (subset instanceof Array){
    return subset.every(this.contains, this);
  } else {
    throw new Error("Can only see if the Client List contains a client's name, a Client, or an Array of client names or Client objects");
  }
}

/**
 * Returns the size of the room - the number of Client objects in the room.
 *
 * @method size
 * @return {Number} Number of Client objects in the room
 */
Clients.prototype.size = function(){
  return this._clients.filter(function(v){return v !== undefined}).length;
}
 
/**
 * Translates the provided message and sends the translation and provided 
 * aciton, in appropriate media, to all clients in the list.
 *
 * If ignore_clients is provided, than the provided message and action will not
 * be translated and emitted to any Client objects in the Clients list that are
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
 * @param {String} action The Socket.IO action to broadcast
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
  if (params.ignore_clients === undefined)
    params.ignore_clients = [];
  var emit_params = {
      action: params.action,
      msg: params.msg,
      from_lang: params.from_lang,
      output_media: params.output_media
  };
  this._clients.filter(function(v){return v !== undefined}).forEach(function(client){
    if (params.ignore_clients.indexOf(client) === -1)
      client.emit(emit_params); 
  });
}

module.exports = Clients
