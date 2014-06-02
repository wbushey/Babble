"use strict";
var expect = require('chai').expect;
var room = require('../routes/translationRoom').create();
var io_client = require('socket.io-client');
var io_clients = [];

room.listen(5000);
var serverURL = 'http://0.0.0.0:5000/';
var conn_options ={
  transports: ['websocket'],
  'force new connection': true
};

// Setup dummy clients
var emitteds = [];
for (var i = 0; i < 5; i++){
  var new_io_client = new io_client.connect(serverURL, conn_options);
  new_io_client.on('join', function(data){
    emitteds[i] = data;
  });
  new_io_client.on('new message', function(data){
    emitteds[i] = data;
  });
  new_io_client.on('leave', function(data){
    emitteds[i] = data;
  });
  io_clients.push(new_io_client);
}
var langs = ['en', 'es', 'pt', 'fr', 'ja'];

describe('room', function(){
  describe('join', function(){
    it("should exist", function(){
    });

    it("should add a joining client to the room", function(){
      var l = room.length;
      io_clients[0].emit('join', {name: 'one', from_lang: langs[0], to_lang: langs[0], output_media: ['text']});
      expect(room.length).to.equal(l + 1);
    });

    it("should tell other room members a new client joined", function(){
      io_clients[1].emit('join', {name: 'dos', from_lang: langs[1], to_lang: langs[1], output_media: ['text']});
      io_clients[2].emit('join', {name: 'três', from_lang: langs[2], to_lang: langs[2], output_media: ['text']});
      expect(emitteds[0]).to.equal('Three has joined');
      expect(emitteds[1]).to.equal('Tres se ha unido a');
    });
  });

  describe('new message', function(){
    it("should exist", function(){

    });

    it("should broadcast the provided message to all clients in their language and media of choice", function(){

    });
  });

  describe('leave', function(){
    it("should remove the leaving client from the room", function(){

    });
  });
});
