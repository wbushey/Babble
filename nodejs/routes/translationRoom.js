"use strict";
var SocketIO = require('socket.io');
var Clients = require('../classes/clients');
var Client = require('../classes/client');

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

      console.log('Room: ' + data.name + " is joining");
      data['socket'] = socket;
      var new_client = new Client(data);
      socket.translation_client = new_client;
      io.clients.insert(new_client);

      var broadcast_params = {
        action: 'join',
        msg: data.name + ' has joined',
        from_lang: 'en',
        output_media: ['text'],
      };
      io.clients.broadcast(broadcast_params);
    });

    /**
     * Action issued when a client sends a message to be tanslated and broadcast
     *
     * @event new message
     * @param msg {String} The message to be translated and broadcast
     */
    socket.on('new message', function(data){
      if (typeof data === 'string')
        data = JSON.parse(data);

      var speaking_client = socket.translation_client;

      var broadcast_params = {
        action: 'new message',
        msg: data.msg,
        from_lang: speaking_client.from_lang(),
        ignore_clients: [speaking_client]
      };
      io.clients.broadcast(broadcast_params);
    });

    /**
     * Issued when a client leaves the room
     *
     * @event leave
     */
    socket.on('leave', function(data){

    });
  });

  return io;
}

exports.create = create;
