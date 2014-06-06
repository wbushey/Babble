"use strict";
var expect = require('chai').expect;
var room = require('../routes/translationRoom').create().listen(5000);
var io_client = require('socket.io-client');
var io_clients = [];

var serverURL = 'http://localhost:5000';
var conn_options ={
  forceNew: true
};

var add_output = function(a_client, i){
  var self = a_client;
  self.name = i;
  self.joined = false;
  var output = function(data){
    self.emitted = JSON.parse(data);
    console.log("Client Socket " + self.name + " recevied: ");
    console.log(JSON.stringify(self.emitted, null, 4));
  }
  
  self.on('join', output);
  self.on('new message', output);
  self.on('leave', output);
  return self;
};

// Setup dummy clients
for (var i = 0; i < 5; i++){
  var new_io_client = add_output(new io_client.connect(serverURL, conn_options), i);
  io_clients.push(new_io_client);
}
var langs = ['en', 'es', 'fr', 'pt', 'ja'];

describe('room', function(){
  describe('join', function(){

    it("should tell all room members a new client joined", function(done){
      this.timeout(5000);
      console.log();
      console.log("Using Socket.IO to connect clients to the server and join the Room. Clients 0 and 1 are joining. Upon Client 1's joining, " +
                  "Client 0 should get a message indicating that Client 1 has joined.");

      var l = room.clients.size(); 

      var check_join2 = function(data){
        // Check Conditions
        if (io_clients[0].emitted && io_clients[1].emitted && io_clients[2].emitted){ 
          expect(room.clients.size()).to.equal(l + 1);
          l++;
          expect(io_clients[0].emitted.text).to.equal('2 has joined');
          expect(io_clients[1].emitted.text).to.equal('2 se ha unido a');
          expect(io_clients[2].emitted.text).to.equal('2 a rejoint');
          done();
        }
      }

      var check_join1 = function(data){
        // Check Conditions
        if (io_clients[0].emitted && io_clients[1].emitted){ 
          expect(room.clients.size()).to.equal(l + 1);
          l++;
          expect(io_clients[0].emitted.text).to.equal('1 has joined');
          expect(io_clients[1].emitted.text).to.equal('1 se ha unido a');

        // Reset
        io_clients[0].removeListener('join', check_join1);
        io_clients[0].emitted = null;
        io_clients[1].removeListener('join', check_join1);
        io_clients[1].emitted = null;

        // Add new listner
        io_clients[0].on('join', check_join2);
        io_clients[1].on('join', check_join2);
        io_clients[2].on('join', check_join2);

        // Start a new join
        io_clients[2].emit('join', {name: io_clients[2].name, from_lang: langs[2], to_lang: langs[2], output_media: ['text']}); 
        }
      };
      var check_join0 = function(data){
        // Check Condition
        expect(room.clients.size()).to.equal(l + 1);
        l++;
        expect(io_clients[0].emitted.text).to.equal('0 has joined');

        // Reset
        io_clients[0].removeListener('join', check_join0);
        io_clients[0].emitted = null;

        // Add new listner
        io_clients[0].on('join', check_join1);
        io_clients[1].on('join', check_join1);

        // Start a new join
        io_clients[1].emit('join', {name: io_clients[1].name, from_lang: langs[1], to_lang: langs[1], output_media: ['text']}); 
      };
      io_clients[0].on('join', check_join0);

      // Start the joining
      io_clients[0].emit('join', {name: io_clients[0].name, from_lang: langs[0], to_lang: langs[0], output_media: ['text']});
    });
  });

  describe('new message', function(){

    it("should broadcast the provided message to all clients in their language and media of choice", function(done){
      io_clients[0].emitted = null;
      io_clients[1].emitted = null;
      var check_message = function(data){
        if(io_clients[0].emitted){
          expect(io_clients[0].emitted.text).to.equal('Hello');
          done();
        }
      };

      io_clients[0].on('new message', check_message);
      io_clients[1].on('new message', check_message);
      io_clients[1].emit('new message', {msg: 'Hola'});
    });
  });

  describe('leave', function(){
    it("should remove the leaving client from the room", function(){

    });
  });
});
