"use strict";
var expect = require('chai').expect;
var Client = require('../classes/client');
var Clients = require('../classes/clients');

// Setup a dummy Socket with a dummy emit method
var Socket = function(){
    this.emitted = "";
    this.action = "";

};

Socket.prototype.emit = function(action, msg){
    this.emitted = JSON.parse(msg);
    this.action = action;
};

var insert_done = function(socket, done){
  socket.real_emit = socket.emit;
  socket.emit = function(action, msg){
    socket.real_emit(action, msg);
    done();
  };
  return socket;
};

var sockets = [];
var client_objs = [];


describe("Client", function(){

  describe("name()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('name');
    });
    it("should return an empty string if no name is passed to the constructor", function(){
      var client = new Client();
      expect(client.name()).to.be.a('string');
      expect(client.name()).to.empty;
    });
    it("should return a string provided to it via the constructor", function(){
      var client = new Client({name: "Bob"});
      expect(client.name()).to.equal("Bob");
    });
    it("should be able to set the name to a string", function(){
      var client = new Client();
      client.name('Bob');
      expect(client.name()).to.equal("Bob");
    });
  });

  describe("from_lang()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('from_lang');
    });
    it("should return an empty string if no from_lang is passed to the constructor", function(){
      var client = new Client();
      expect(client.from_lang()).to.be.a('string');
      expect(client.from_lang()).to.empty;
    });
    it("should return a string provided to it via the constructor", function(){
      var client = new Client({from_lang: "en"});
      expect(client.from_lang()).to.equal("en");
    });
    it("should be able to set the from_lang to a string", function(){
      var client = new Client();
      client.from_lang('en');
      expect(client.from_lang()).to.equal("en");
    });
  });

  describe("to_lang()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('to_lang');
    });
    it("should return an empty string if no to_lang is passed to the constructor", function(){
      var client = new Client();
      expect(client.to_lang()).to.be.a('string');
      expect(client.to_lang()).to.empty;
    });
    it("should return a string provided to it via the constructor", function(){
      var client = new Client({to_lang: "en"});
      expect(client.to_lang()).to.equal("en");
    });
    it("should be able to set the to_lang to a string", function(){
      var client = new Client();
      client.to_lang('en');
      expect(client.to_lang()).to.equal("en");
    });
  });

  describe("socket()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('socket');
    });
    it("should return null if no socket is passed to the constructor", function(){
      var client = new Client();
      expect(client.socket()).to.be.null;
    });
    it("should throw an error if a socket is provided to the constructor that has no 'emit' method", function(){
      expect(function(){new Client({socket: new Object()})}).to.throw(Error);
    });
  });

  describe("output_media()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('output_media');
    });
    it("should return an empty array if no output_media are passed to the constructor", function(){
      var client = new Client();
      expect(client.output_media()).to.be.an('Array');
      expect(client.output_media()).to.empty;
    });
    it("should return an array provided to it via the constructor", function(){
      var client = new Client({output_media: ["text"]});
      expect(client.output_media()).to.deep.equal(["text"]);
      expect(function(){new Client({output_media: "text"})}).to.throw(Error);
    });
    it("should be able to set the output_media to an array and only an array", function(){
      var client = new Client();
      client.output_media(["text", "audio"]);
      expect(client.output_media()).to.deep.equal(["text", "audio"]);
      expect(function(){client.output_media("text")}).to.throw(Error);
    });
  });


  describe("emit()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('emit');
    });
    it("should throw an error if no socket is set", function(){
      var client = new Client();
      expect(function(){client.emit({msg: 'dummy', from_lang: 'en'})}).to.throw(Error);
    });
    it("should call the instance's socket.emit() method with whatever arguments are provided", function(done){
      sockets[0] = insert_done(new Socket(), done);
      client_objs[0] = new Client({socket: sockets[0], to_lang: 'en', output_media: ['text']});
      client_objs[0].emit({action: 'new message', msg: 'Hi', from_lang: 'en'});
    });
    it("socket[0].emitted should be what was provided above", function(){
      expect(sockets[0].emitted.text).to.equal('Hi');
    });
    it("should emit a message using the provided action", function(){
      expect(sockets[0].action).to.equal('new message');
    });
    it("should fetch the correct translation for 'Hi' in Spanish", function(done){
      client_objs[0].to_lang('es');
      sockets[0].emit = function(action, msg){
        sockets[0].real_emit(action, msg);
        done();
      };
      client_objs[0].emit({msg: 'Hello', from_lang: 'en'});
    });
    it("fetched translation should have a 'text' property equa to 'Hola'", function(){
      expect(sockets[0].emitted).to.have.property('text');
      expect(sockets[0].emitted.text).to.equal('Hola');
    });
  });
});

var clients;
client_objs = [];
sockets = [];
var insert_count_and_done = function(socket, done){
  socket.real_emit = socket.emit;
  socket.emit = function(action, msg){
  console.log("emitting " + msg + " to socket " + socket.name);
  socket.real_emit(action, msg);
  clients.done++;
  console.log("clients.done: " + clients.done);
  if (clients.done == clients.size())
    done();
  };
  return socket;
};

describe('Clients', function(){
  describe("name()", function(){
    it("should exist", function(){
      clients = new Clients();
      expect(clients).to.have.property('name');
    });
    it("should return an empty string if no name is passed to the constructor", function(){
      clients = new Clients();
      expect(clients.name()).to.be.a('string');
      expect(clients.name()).to.empty;
    });
    it("should return a string provided to it via the constructor", function(){
      clients = new Clients({name: "International Discussion"});
      expect(clients.name()).to.equal("International Discussion");
    });
    it("should be able to set the name to a string", function(){
      clients = new Clients();
      clients.name("International Discussion");
      expect(clients.name()).to.equal("International Discussion");
    });
  });

  describe("size()", function(){
    it("should return a number", function(){
      expect(clients.size()).to.be.a('number');
    });
  });

  describe("insert()", function(){
    it("should increase the size of the room by one", function(){
      var room_size = clients.size();
      sockets[0] = new Socket();
      client_objs[0] = new Client({name: 'Tester 1', socket: sockets[0]}); 
      clients.insert(client_objs[0]);
      expect(clients.size()).to.equal(room_size + 1);
    });
    it("should only accept objects with an emit method", function(){
      expect(function(){clients.insert(undefined)}).to.throw(Error);
      expect(function(){clients.insert(new Object())}).to.throw(Error);
    });
  });

  describe("contains()", function(){
    it("should return true if searching for Client objects that are in the room", function(){
      sockets[1] = new Socket();
      client_objs[1] = new Client({name: 'Tester 2', socket: sockets[1]});
      clients.insert(client_objs[1]);
      expect(clients.contains(['Tester 1', client_objs[1]])).to.be.true;
    });
    it("should return false if searching for a Client that isn't in the room", function(){
      expect(clients.contains('foobar 1')).to.be.false;
    });
  });

  describe("remove()", function(){
    it("should successfully remove a client that it contains by name", function(){
      expect(clients.remove('Tester 1')).to.be.true;
      expect(clients.remove(client_objs[1])).to.be.true;
      expect(clients.contains(client_objs[0])).to.be.false;
      expect(clients.contains('Tester 2')).to.be.false;
    });
  });

  describe("broadcast()", function(){
    it("should exist", function(){
      expect(clients).to.have.property('broadcast');
    });
    it("should send a message to all Client objects in the Clients list if ignore_clients is not provided", function(done){
      this.timeout(10000);
      

      clients.done = 0;
      sockets[0] = new Socket();
      sockets[0].name = '0';
      client_objs[0] = new Client({name: 'Tester 1', socket: sockets[0], output_media: ['text', 'audio'], to_lang: 'es'}); 
      sockets[1] = new Socket();
      sockets[1].name = '1';
      client_objs[1] = new Client({name: 'Tester 2', socket: sockets[1], output_media: ['text', 'audio'], to_lang: 'fr'});
      sockets = sockets.map(function(s){return insert_count_and_done(s, done)});
      clients.insert(client_objs[0]);
      clients.insert(client_objs[1]);
      var broadcast_params = {
        action: 'new message',
        msg: 'Hello',
        from_lang: 'en'
      };
      clients.broadcast({action: 'new message', msg: 'Hello', from_lang: 'en'});
    });
    it("sockets[0].emitted.text should be 'Hola', sockets[1].emitted.text should be 'Salut'", function(){
      for (var i = 0; i < sockets.length; i++){
        console.log("sockets[" + i + "]");
        console.log(JSON.stringify(sockets[i].emitted, null, 4));
      }
      expect(sockets[0].emitted.text).to.equal('Hola');
      expect(sockets[1].emitted.text).to.equal('Salut');
    });
    it("should not send a message to all Client objects provided in an ignore_clients list", function(){
      var socket1 = new Socket();
      var socket2 = new Socket();
      var socket3 = new Socket();
      var client1 = new Client({socket: socket1, to_lang: "es", output_media: ["text"]});
      var client2 = new Client({socket: socket2, to_lang: "fr", output_media: ["text"]});
      var client3 = new Client({socket: socket3, to_lang: "ja", output_media: ["text"]});
      var clients = new Clients();
      clients.insert(client1);
      clients.insert(client2);
      clients.insert(client3);
      clients.broadcast({action: 'new message', msg: 'Hello', from_lang: 'en', ignore_clients: [client2, client3]});
      expect(socket1.emitted).to.equal('hola');
      expect(socket2.emitted).to.be.empty;
      expect(socket3.emitted).to.be.empty;
    });

  });
});
