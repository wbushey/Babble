"use strict";
var expect = require('chai').expect;
var Client = require('../classes/client');

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
    var emitted = "";
    var Socket = function(){};
    Socket.prototype.emit = function(msg){
      emitted = msg;
    }

    it("should exist", function(){
      var client = new Client();
      expect(client).to.have.property('emit');
    });
    it("should throw an error if no socket is set", function(){
      var client = new Client();
      expect(client.emit()).to.throw(Error);
    });
    it("should call the instance's socket.emit() method with whatever arguments are provided", function(){
      var client = new Client({socket: new Socket()});
      client.emit('Hi');
      expect(emitted).to.equal('Hi');
    });
    it("should emit an object containing .text = 'hola' when asked to translate 'hello' to Spanish in text", function(){
      var client = new Client({socket: new Socket(), to_lang: "es", output_media: ["text"]});
      client.emit('Hello');
      expect(emitted).to.have.property('text');
      expect(emitted.text).to.equal('hola');
    });
  });
});
