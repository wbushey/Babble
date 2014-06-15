"use strict";
var SocketIO = require('socket.io');
var Clients = require('../classes/clients');
var Client = require('../classes/client');
var secrets = require('../utils/getSecrets.js');
var magic = secrets.getSecret('magic');

function create(server){
  var io = new SocketIO(server);
  io.clients = new Clients();

  io.sockets.on('connection', function(socket){

    /**
     * Action issued when a client joins the room. The joining client will
     * be added to the room, and all other clients will be told of the joining.
     *
     * @event join
     * @param name {String} Name of the joining client
     * @param to_lang {String} Language the joining client wants to receive
     * @param from_lang {String} Language the joining client will send
     * @param output_media {String[]} Media the client wants to receive in
     */
    socket.on('join', function(data){
      if (typeof data === 'string')
        data = JSON.parse(data);

      data.socket = socket;
      var new_client = new Client(data);
      socket.translation_client = new_client;
      io.clients.insert(new_client);

      var broadcast_params = {
        action: 'join',
        from_name: data.name,
        msg: data.name + ' has joined',
        from_lang: 'en',
        output_media: ['text'],
        session: data.session
      };
      io.clients.broadcast(broadcast_params);
    });

    /**
     * Action issued when a client sends a message to be translated and broadcast
     *
     * @event new message
     * @param msg {String} The message to be translated and broadcast
     */
    socket.on('new message', function(data){
      if (typeof data === 'string')
        data = JSON.parse(data);

      var speaking_client = socket.translation_client;
      if (typeof speaking_client == 'undefined') {
         return;
      }
      
      var broadcast_params = {
        action: 'new message',
        from_name: speaking_client.name(),
        msg: data.msg,
        from_lang: speaking_client.from_lang(),
        ignore_clients: [speaking_client],
        session: speaking_client.session()
      };
      io.clients.broadcast(broadcast_params);
    });

    /**
     * Issued when a client leaves the room
     *
     * @event disconnect
     */
    socket.on('disconnect', function(data){
      console.log('disconnect received');
      if (socket.translation_client){
        var broadcast_params = {
          action: 'leave',
          msg: socket.translation_client.name() + ' has left',
          from_lang: 'en',
          output_media: ['text'],
          magic: magic     // Verifies that message was sent by the server to prevent spoofing.
        };
        io.clients.broadcast(broadcast_params);
        io.clients.remove(socket.translation_client);
      } else {
        console.log('No translation client'); 
      }
    });
    
    /**
     * Action issued when a client requests the list of client names.
     *
     * @event client names
     */
    socket.on('client names', function(data){
      var client = socket.translation_client;
      if (client){
        var client_names = '' + io.clients.client_names().filter(function(x){return x;});
        client.socket().emit('client names', client_names);
      }
    });
    
    socket.on('private message', function(data){
      var speaking_client = socket.translation_client;
      if (!speaking_client) {
        console.log('No speaking client');
        return;
      }
      var idx = io.clients.client_names().indexOf(data.to);
        
      if (idx == -1) {
        console.log('Recipient not found');
        return;
      }
      var receiving_client = io.clients._clients[idx];
        
      if (data.session != speaking_client.session()) {
        console.log('Invalid session ID');
        return;
      }
        
      var emit_params = {
        action: 'private message',
        from_name: speaking_client.name(),
        msg: data.msg,
        from_lang: speaking_client.from_lang(),
        output_media: speaking_client.output_media(),
        session: receiving_client.session()
      };
        
      receiving_client.emit(emit_params);
    });
  });

  return io;
}

exports.create = create;
