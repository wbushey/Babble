var parseString = require('xml2js').parseString;
var fetchTranslation = require('../utils/microsoft-fetchTranslation');

var username_regex = /^[a-zA-Z0-9_]{1,14}$/;
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
var Client = function(params){
  // Instance Variables
  this._name = "";
  this._from_lang = "";
  this._to_lang = "";
  this._output_media = [];
  this._socket = null;
  this._session = "";
  this._channels = ['public'];
  this._ignore = [];

  if (params !== undefined){
    this.name(params.name);
    this.from_lang(params.from_lang);
    this.to_lang(params.to_lang);
    this.output_media(params.output_media);
    this.socket(params.socket);
    this.session(params.session);
  }
};

/**
 * Access and modify the Client's name. If called without an argument, it will
 * return the Client's current name. If called with an argument, it will set
 * the Client's name to the provided string, and return the newly set name.
 *
 * @method name
 * @param {String} new_name A string to set the Client's name to
 * @returns {String} The Client's name
 */
Client.prototype.name = function(new_name){
  if (new_name !== undefined) {
    if (new_name.match(username_regex)) {
      this._name = new_name;
    } else {
      this.socket().emit('err', 'Invalid nickname');
    }
  }
  return this._name;
};

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
 * @returns {String} The Client's language to translate from
 */
Client.prototype.from_lang = function(new_from_lang){
  if(new_from_lang !== undefined)
    this._from_lang = new_from_lang;

  return this._from_lang;
};

/**
 * Access and modify the Client's language to translate to. If called without
 * an argument, it will return the Client's current language to translate to.
 * If called with an argument, it will set the Client's language to translate 
 * to to the provided string, and return the newly set language to translate to.
 *
 * @method to_lang
 * @param {String} new_to_lang A string representing the language to translate 
                               to for the client
 * @returns {String} The Client's language to translate to
 */

Client.prototype.to_lang = function(new_to_lang){
  if(new_to_lang !== undefined)
    this._to_lang = new_to_lang;

  return this._to_lang;
};



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
 * @throws {Error} If new_output_media is provided, it must be an array 
 * @returns {String[]} The Client's media to output
 */
Client.prototype.output_media = function(new_output_media){
  if(new_output_media !== undefined){
    if(!(new_output_media instanceof Array))
      throw new Error("output_media must be an Array");
    this._output_media = new_output_media;
  }

  return this._output_media;
};

/**
 * Access and modify the Client's socket. If called without an argument, it
 * will return the Client's current socket. If called with an argument, it will
 * set the Client's socket to the provided Socket, and return the newly set
 * socket.
 *
 * @method socket
 * @param {Socket} new_socket A Socket to set the Client's socket to
 * @returns {Socket} The Client's socket
 */
Client.prototype.socket = function(new_socket){
  if(new_socket !== undefined){
    if (typeof new_socket.emit !== 'function')
      throw new Error("socket must have an emit method");
    this._socket = new_socket;
  }

  return this._socket;
};

Client.prototype.session = function(new_session){
  if (new_session !== undefined) {
    this._session = new_session;
  }
  return this._session;
};
  
/**
 * Translates the provided message and sends the translation with the provided 
 * action, in appropriate media, to the client. If output_media is provided, 
 * it will determine which media to translate to and emit. Otherwise, the 
 * Client's output_media property will be used to determine which media to 
 * output to.
 *
 * What actually is emitted varies between the output media.
 * All emitted messages will have message_id and orig_text properties.
 * When using the "text" output medium, the emitted object will include a
 * "text" property set to a string containing the actual translation.
 * When using the "audio" output medium, the emitted object will include an 
 * "audio" property set to translations will be emitted as a URL to an audio
 * stream of the translation.
 * If an error occurs during fetching, the emitted object will include an
 * "error" property set to an object representing the received error.
 *
 * @method emit
 * @param {String} action The Socket.IO action to emit
 * @param {String} from_name Username of the person that the message is from
 * @param {String} msg The string to translate
 * @param {String} from_lang Language code for the language that msg is 
 *                           currently in
 * @param {String[]} [output_media] If provided, this will override the 
 *                                  output_media of the client for this emission
 * @throws {Error} If socket is not already set
 */
Client.prototype.emit = function(params){
  var self = this;
  var output_media = params.output_media ? params.output_media : this.output_media();

  if(this.socket() === undefined)
    throw new Error("Socket not set, can not emit messages");
  if(typeof this.socket().emit !== "function")
    throw new Error("Socket does not have an emit method");

  // Set the callbacks
  var fetched = "";
  var on_data = function(chunk) {
    fetched += chunk.toString();
  };
  
  var on_end = function(data){
    parseString(fetched, function(err, parsed){
      var return_obj = {};
      if (params.hasOwnProperty('from_name')){
        return_obj.from_name = String(params.from_name);
      }
      return_obj.message_id = (new Date()).valueOf();
      return_obj.orig_text = params.msg;
      return_obj.channel = params.channel;
      if (parsed.hasOwnProperty('string')){
        if (output_media.indexOf('text') !== -1)
          return_obj.text = parsed.string._;
        if (output_media.indexOf('audio') !== -1){
          return_obj.audio = '/translateAudio?mid=' + return_obj.message_id;
          return_obj.audio += '&text=' + parsed.string._;
          return_obj.audio += '&to=' + self.to_lang();
        }
      } else if (parsed.hasOwnProperty('html')){
        return_obj.error = parsed.html;
      } else {
        return_obj.error = parsed;
      }

      self.socket().emit(params.action, JSON.stringify(return_obj));
    });
  };
  var on_error = function(e){
    self.socket().emit('error', e.message);
  };

  // Setup the fetch request
  var fetch_options = {
    msg: params.msg,
    from_lang: params.from_lang,
    to_lang: this.to_lang(),
    on_data: on_data,
    on_end: on_end,
    on_error: on_error
  };

  // Note that to do either an audio or text translation, we must first
  // fetch a text translation. The client's choice of output media is entirely
  // an option on what the client *receives*.
  fetch_options.medium = 'text';
  fetchTranslation(fetch_options);
};

/**
 * Access and modify the Client's channel list. If called without
 * an argument, it will return the Client's current channel list.
 * If called with an argument, it will set the Client's channel list
 * to the provided list, and return the newly set channel list.
 *
 * @method channels
 * @param {Object} new_channels A new channel list.
 * @returns {String} The Client's channel list.
 */
Client.prototype.channels = function(new_channels){
  if(new_channels !== undefined)
    this._channels = new_channels;

  return this._channels;
};

Client.prototype.join_channel = function(channel){
  if (channel.match(username_regex)) {
    if (this._channels.indexOf(channel) == -1)
      this._channels.push(channel);
  } else {
    this.socket().emit('err', 'Invalid channel name');
  }
};

Client.prototype.part_channel = function(channel){
  var idx = this._channels.indexOf(channel);
  if (idx != -1)
    delete this._channels[idx];
};

Client.prototype.find_channel = function(channel){
  return this._channels.indexOf(channel);
};

Client.prototype.ignore = function(new_ignore){
  if (new_ignore !== undefined)
    this._ignore = new_ignore;
  return this._ignore;
};

Client.prototype.add_ignore = function(name){
  if (this._ignore.indexOf(name) == -1)
    this._ignore.push(name);
};

Client.prototype.remove_ignore = function(name){
  var idx = this._ignore.indexOf(name);
  if (idx != -1)
    delete this._ignore[idx];
};

module.exports = Client;
