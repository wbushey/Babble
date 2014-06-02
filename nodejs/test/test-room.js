"use strict";
var expect = require('chai').expect;
var room = require('../routes/translationRoom').create();
var io_client = require('socket.io-client');
var io_clients = [];

var msFetchTranslation = require("../utils/microsoft-fetchTranslation").fetchTranslation

describe('room', function(){
  describe('join', function(){
    it("should exist", function(){
    });

    it("should add a joining client to the room", function(){

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
