"use strict";
var expect = require('chai').expect

var msFetchTranslation = require("../utils/microsoft-fetchTranslation").fetchTranslation

describe('fetchTranslation', function(){
  describe('microsoft-fetchTranslation', function(){
    it("should fetch 'hola', the Spanish for 'hello', from Microsoft's Translation service", function(){
      var fetched_translation = msFetchTranslation('hello', 'en', 'es', 'text');
      expect(fetched_translation).to.be.a('string');
      expect(fetched_translation).to.equal('hola');
    });

    it("should return a URL of an audio stream", function(){
      var fetched_translation = msFetchTranslation('hello', 'en', 'es', 'audio');
      expect(fetched_translation).to.be.a('string');
    });
  });
});
