"use strict";
var expect = require('chai').expect;
var createDummyServerSocket = require('./helpers').createDummyServerSocket;
var clear = require('./helpers').clear;
var Client = require('../classes/client');
var Clients = require('../classes/clients');

var sockets = [];
var client_objs = [];

describe("Client", function(){
  this.timeout(10000);

  describe("name()", function(){
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
    it("should return null if no socket is passed to the constructor", function(){
      var client = new Client();
      expect(client.socket()).to.be.null;
    });
    it("should throw an error if a socket is provided to the constructor that has no 'emit' method", function(){
      expect(function(){new Client({socket: new Object()})}).to.throw(Error);
    });
  });

  describe("output_media()", function(){
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
    it("should throw an error if no socket is set", function(){
      var client = new Client();
      expect(function(){client.emit({msg: 'dummy', from_lang: 'en'})}).to.throw(Error);
    });

    it("should call the instance's socket.emit() method with whatever arguments are provided", function(done){
      sockets[0] = createDummyServerSocket(0);
      sockets[0].emit = function(action, msg){
        sockets[0].real_emit(action, msg);
        expect(sockets[0].data.text).to.equal('Hi');
        expect(sockets[0].action).to.equal('new message');
        sockets[0].emit = sockets[0].real_emit;
        done();
      }
      client_objs[0] = new Client({socket: sockets[0], to_lang: 'en', output_media: ['text']});
      client_objs[0].emit({action: 'new message', msg: 'Hi', from_lang: 'en'});
    });

    it("should fetch the correct translation for 'Hi' in Spanish", function(done){
      client_objs[0].to_lang('es');
      sockets[0].emit = function(action, msg){
        sockets[0].real_emit(action, msg);
        expect(sockets[0].data).to.have.property('text');
        expect(sockets[0].data.text).to.equal('Hola');
        sockets[0].emit = sockets[0].real_emit;
        done();
      };
      client_objs[0].emit({msg: 'Hello', from_lang: 'en'});
    });
  });
});

// Reset and prep for Clients testing
var clients;
client_objs = [];
sockets = [];

describe('Clients', function(){
  this.timeout(10000);

  describe("name()", function(){
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
      sockets[0] = createDummyServerSocket(0);
      client_objs[0] = new Client({name: 'Tester 0', socket: sockets[0]}); 
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
      sockets[1] = createDummyServerSocket(1);
      client_objs[1] = new Client({name: 'Tester 1', socket: sockets[1]});
      clients.insert(client_objs[1]);
      expect(clients.contains(['Tester 0', client_objs[1]])).to.be.true;
    });
    it("should return false if searching for a Client that isn't in the room", function(){
      expect(clients.contains('foobar 1')).to.be.false;
    });
  });

  describe("remove()", function(){
    it("should successfully remove a client that it contains by name", function(){
      expect(clients.remove('Tester 0')).to.be.true;
      expect(clients.remove(client_objs[1])).to.be.true;
      expect(clients.contains(client_objs[0])).to.be.false;
      expect(clients.contains('Tester 1')).to.be.false;
    });
  });

  describe("broadcast()", function(){
    it("should send a message to all Client objects in the Clients list if ignore_clients is not provided", function(done){
      console.log();
      console.log('Braodcasting to Clients 0 and 1');

      clients.done = 0;
      sockets[0] = createDummyServerSocket(0);
      client_objs[0] = new Client({name: 'Tester 0', socket: sockets[0], output_media: ['text', 'audio'], to_lang: 'es'}); 
      sockets[1] = createDummyServerSocket(1);
      client_objs[1] = new Client({name: 'Tester 1', socket: sockets[1], output_media: ['text'], to_lang: 'fr'});
      var check_sent_messages = function(action, data){
        this.real_emit(action, data);
        this.emit = this.real_emit;
        if (sockets[0].data && sockets[1].data){
          expect(sockets[0].data.text).to.equal('Hola');
          expect(sockets[0].data.audio).to.be.a('string');
          expect(sockets[0].data.audio).to.have.string('/translateAudio');
          expect(sockets[0].data.audio).to.have.string('text=Hola');
          expect(sockets[0].data.audio).to.have.string('to=es');
          expect(sockets[1].data.text).to.equal('Salut');
          expect(sockets[1].data.audio).to.be.undefined;
          done();
        }
      }
      sockets[0].emit = check_sent_messages;
      sockets[1].emit = check_sent_messages;

      clients.insert(client_objs[0]);
      clients.insert(client_objs[1]);
      var broadcast_params = {
        action: 'new message',
        msg: 'Hello',
        from_lang: 'en'
      };
      clients.broadcast({action: 'new message', msg: 'Hello', from_lang: 'en'});
    });

    it("should not send a message to all Client objects provided in an ignore_clients list", function(done){
      console.log();
      console.log('Broadcasting to Clients 0, 1, and 2, with Clients 1 and 2 on the ignore_clients list');

      sockets.forEach(clear);
      sockets[2] = createDummyServerSocket(2);
      client_objs[2] = new Client({socket: sockets[2], to_lang: "ja", output_media: ["text"]});
      clients.insert(client_objs[2]);

      var check_sent_messages = function(action, data){
        this.real_emit(action, data);
        this.emit = this.real_emit;
        if (sockets[0].data){
          expect(sockets[0].data.text).to.equal('Hola');
          expect(sockets[1].data).to.be.null;
          expect(sockets[2].data).to.be.null;
          done();
        }
      };
      sockets[0].emit = check_sent_messages;

      var broadcast_params = {
        action: 'new message', 
        msg: 'Hello', 
        from_lang: 'en', 
        ignore_clients: [client_objs[1], client_objs[2]]
      }
      clients.broadcast(broadcast_params);
    });
  });
});
