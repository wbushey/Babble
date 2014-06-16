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
        session: speaking_client.session(),
        channel: data.channel
      };
      io.clients.broadcast(broadcast_params);
    });

    /**
     * Issued when a client leaves the room
     *
     * @event disconnect
     */
    socket.on('disconnect', function(data){
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
     * @event names
     */
    socket.on('names', function(channel){
      console.log('names ' + channel);
      if (typeof channel !== 'string'){
        console.log('Parameter for names action should be a string.');
        return;
      }
      var client = socket.translation_client;
      if (client){
        var client_names = [];
        io.clients._clients.forEach(function(cl) {
          if (cl.channels().indexOf(channel) != -1) {
            client_names.push(cl.name());
          }
        });
        client.socket().emit('names', client_names);
        console.log('found names: ' + client_names);
      }
    });
    
    socket.on('private message', function(data){
      if (typeof data === 'string')
        data = JSON.parse(data);
      
      var speaking_client = socket.translation_client;
      if (!speaking_client) {
        console.log('No speaking client');
        return;
      }
      
      if (data.session != speaking_client.session()) {
        console.log('Invalid session ID');
        return;
      }
      
      if (typeof data.to !== 'string') {
        console.log('Missing or invalid recipients list.');
        return;
      }
      
      var seen = {};
      seen[speaking_client.name()] = true;
      
      data.to.split(',').forEach(function(recipient) {
        if ((recipient === undefined) || (recipient in seen))
          return;
        var idx = io.clients.client_names().indexOf(recipient);
        if (idx == -1) {
          console.log('Recipient not found');
          return;
        }
        seen[recipient] = true;
        var receiving_client = io.clients._clients[idx];
        if (receiving_client.ignore().indexOf(speaking_client.name()) != -1) {
          console.log('Sender ignored by recipient.');
          return;
        }
        
        var emit_params = {
          action: 'private message',
          from_name: speaking_client.name(),
          msg: data.msg,
          from_lang: speaking_client.from_lang(),
          session: receiving_client.session()
        };
        
        receiving_client.emit(emit_params);
      });
    });
    
    socket.on('join channels', function(data) {
      if (typeof data === 'string')
        data = JSON.parse(data);

      var speaking_client = socket.translation_client;
      if (!speaking_client) {
        console.log('No speaking client');
        return;
      }
      if (typeof data.channels !== 'string') {
        console.log('Bad or missing channel list');
        return;
      }
      data.channels.split(',').forEach(function(channel){
        speaking_client.join_channel(channel);
      });
    });
    
    socket.on('part', function(data) {
      if (typeof data === 'string')
        data = JSON.parse(data);
      var speaking_client = socket.translation_client;
      if (!speaking_client) {
        console.log('No speaking client');
        return;
      }
      data.channels.split(',').forEach(function(channel){
        speaking_client.part_channel(channel);
      });
    });
  
    socket.on('ignore', function(data) {
      if (typeof data === 'string')
        data = JSON.parse(data);
      console.log(JSON.stringify(data));
      var speaking_client = socket.translation_client;
      if (!speaking_client) {
        console.log('No speaking client');
        return;
      }
      data.names.split(',').forEach(function (name) {
        speaking_client.add_ignore(name);
      });
    });
  
    socket.on('unignore', function(data) {
      if (typeof data === 'string')
        data = JSON.parse(data);
      var speaking_client = socket.translation_client;
      if (!speaking_client) {
        console.log('No speaking client');
        return;
      }
      if ('all' in data) {
        speaking_client.ignore([]);
      } else {
        data.names.split(',').forEach(function (name) {
          speaking_client.remove_ignore(name);
        });
      }
    });
  });
  
  return io;
}

exports.create = create;
