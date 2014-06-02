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
    this.emitted = msg;
}


describe("Client", function(){

  describe("name()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('name');
    });
    it("should return an empty string if no name is passed to the constructor", function(){
      var client = new Client();
      expect(client.name).to.be.a('string');
      expect(client.name).to.empty;
    });
    it("should return a string provided to it via the constructor", function(){
      var client = new Client({name: "Bob"});
      expect(client.name).to.equal("Bob");
    });
    it("should be able to set the name to a string", function(){
      var client = new Client();
      client.name('Bob');
      expect(client.name).to.equal("Bob");
    });
  });

  describe("from_lang()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('from_lang');
    });
    it("should return an empty string if no from_lang is passed to the constructor", function(){
      var client = new Client();
      expect(client.from_lang).to.be.a('string');
      expect(client.from_lang).to.empty;
    });
    it("should return a string provided to it via the constructor", function(){
      var client = new Client({from_lang: "en"});
      expect(client.from_lang).to.equal("en");
    });
    it("should be able to set the from_lang to a string", function(){
      var client = new Client();
      client.from_lang('en');
      expect(client.from_lang).to.equal("en");
    });
  });

  describe("to_lang()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('to_lang');
    });
    it("should return an empty string if no to_lang is passed to the constructor", function(){
      var client = new Client();
      expect(client.to_lang).to.be.a('string');
      expect(client.to_lang).to.empty;
    });
    it("should return a string provided to it via the constructor", function(){
      var client = new Client({to_lang: "en"});
      expect(client.to_lang).to.equal("en");
    });
    it("should be able to set the to_lang to a string", function(){
      var client = new Client();
      client.to_lang('en');
      expect(client.to_lang).to.equal("en");
    });
  });

  describe("socket()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('socket');
    });
    it("should return null if no socket is passed to the constructor", function(){
      var client = new Client();
      expect(client.socket).to.be.null;
    });
    it("should throw an error if a socket is provided to the constructor that has no 'emit' method", function(){
      expect(new Client({socket: new Object()})).to.throw(Error);
    });
  });

  describe("output_media()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('output_media');
    });
    it("should return an empty array if no output_media are passed to the constructor", function(){
      var client = new Client();
      expect(client.output_media).to.be.an('Array');
      expect(client.output_media).to.empty;
    });
    it("should return an array provided to it via the constructor", function(){
      var client = new Client({output_media: ["text"]});
      expect(client.output_media).to.equal(["text"]);
      expect(new Client({output_media: "text"})).to.throw(Error);
    });
    it("should be able to set the output_media to an array and only an array", function(){
      var client = new Client();
      client.output_media(["text", "audio"]);
      expect(client.output_media).to.equal(["text", "audio"]);
      expect(client.output_media("text")).to.throw(Error);
    });
    it("and constructor should not accept arrays that contain values other than 'text' or 'audio'", function(){
      expect(new Client({output_media: ["video", "text"]})).to.throw(Error);
      var client = new Client();
      expect(client.output_media(["video", "audio"])).to.throw(Error);
    });
  });


  describe("emit()", function(){
    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('emit');
    });
    it("should throw an error if no socket is set", function(){
      var client = new Client();
      expect(client.emit({msg: 'dummy', from_lang: 'en'})).to.throw(Error);
    });
    it("should call the instance's socket.emit() method with whatever arguments are provided", function(){
      var socket = new Socket();
      var client = new Client({socket: socket});
      client.emit({msg: 'Hi', from_lang: 'en'});
      expect(socket.emitted).to.equal('Hi');
    });
    it("should emit a message using the 'new message' action", function(){
      var socket = new Socket();
      var client = new Client({socket: socket});
      client.emit({msg: 'Hi', from_lang: 'en'});
      expect(socket.action).to.equal('new message');
    });
    it("should emit an object containing .text = 'hola' when asked to translate 'hello' to Spanish in text", function(){
      var socket = new Socket();
      var client = new Client({socket: socket, to_lang: "es", output_media: ["text"]});
      client.emit({msg: 'Hello', from_lang: 'en'});
      expect(socket.emitted).to.have.property('text');
      expect(socket.emitted.text).to.equal('hola');
    });
  });
});

describe('Clients', function(){
  describe("name()", function(){
    it("should exist", function(){
      var clients = new Clients();
      expect(clients).to.have.property('name');
    });
    it("should return an empty string if no name is passed to the constructor", function(){
      var clients = new Clients();
      expect(clients.name).to.be.a('string');
      expect(clients.name).to.empty;
    });
    it("should return a string provided to it via the constructor", function(){
      var clients = new Clients({name: "International Discussion"});
      expect(clients.name).to.equal("International Discussion");
    });
    it("should be able to set the name to a string", function(){
      var clients = new Clients();
      clients.name("International Discussion");
      expect(clients.name).to.equal("International Discussion");
    });
  });

  describe("broadcast()", function(){
    it("should exist", function(){
      var clients = new Clients();
      expect(clients).to.have.property('broadcast');
    });
    it("should be able to add Client objects to it", function(){
      var client1 = new Client();
      var client2 = new Client();
      var clients = new Clients();
      expect(clients.push(client1)).to.not.throw(Error);
      clients.push(client2);
      expect(clients).to.contain.members([client1, client2]);
    });
    it("should send a message to all Client objects in the Clients list if ignore_clients is not provided", function(){
      var socket1 = new Socket();
      var socket2 = new Socket();
      var client1 = new Client({socket: socket1, to_lang: "es", output_media: ["text"]});
      var client2 = new Client({socket: socket2, to_lang: "fr", output_media: ["text"]});
      var clients = new Clients();
      clients.push(client1);
      clients.push(client2);
      clients.broadcast({msg: 'Hello', from_lang: 'en'});
      expect(socket1.emitted).to.equal('hola');
      expect(socket2.emitted).to.equal('Salut');
    });
    it("should not send a message to all Client objects provided in an ignore_clients list", function(){
      var socket1 = new Socket();
      var socket2 = new Socket();
      var socket3 = new Socket();
      var client1 = new Client({socket: socket1, to_lang: "es", output_media: ["text"]});
      var client2 = new Client({socket: socket2, to_lang: "fr", output_media: ["text"]});
      var client3 = new Client({socket: socket3, to_lang: "ja", output_media: ["text"]});
      var clients = new Clients();
      clients.push(client1);
      clients.push(client2);
      clients.push(client3);
      clients.broadcast({msg: 'Hello', from_lang: 'en', ignore_clients: [client2, client3]});
      expect(socket1.emitted).to.equal('hola');
      expect(socket2.emitted).to.be.empty;
      expect(socket3.emitted).to.be.empty;
    });

  });
});
