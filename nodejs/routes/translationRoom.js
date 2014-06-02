"use strict";
var SocketIO = require('socket.io');
var Clients = require('../classes/clients');

function create(server){
  io = new SocketIO(server);

  io.on('connection', function(socket){
    var clients = new Clients();

    /**
     * Action issued when a client joins the room
     *
     * @event join
     * @param name {String} Name of the joining client
     * @param to_lang {String} Language the joining client wants to receive
     * @param from_lang {String} Language the joining client will send
     * @param output_media {String[]} Media the client wants to receive in
     */
    socket.on('join', function(data){

    });

    /**
     * Action issued when a client sends a message to be tanslated and broadcast
     *
     * @event new message
     * @param msg {String} The message to be translated and broadcast
     */
    socket.on('new message', function(data){

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
