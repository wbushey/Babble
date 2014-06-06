"use strict";
var expect = require('chai').expect
var parseString = require('xml2js').parseString

var msFetchTranslation = require("../utils/microsoft-fetchTranslation")

var fetched = "";
var result = "";
var on_data = function(chunk){
  fetched += chunk.toString();
};
var on_error = function(e){
  console.log("Error: " + e.message);
};

describe('fetchTranslation', function(){
  this.timeout(10000);

  describe('microsoft-fetchTranslation', function(){
    it("should fetch 'hola', the Spanish for 'hello', from Microsoft's Translation service", function(done){
      var on_end = function(){
        parseString(fetched, function(err, parsed){
          result = parsed.string._
          expect(result).to.be.a('string');
          expect(result).to.equal('Hola');
          done();
        });
      };
      var fetch_options = {
        msg: 'hello',
        from_lang: 'en',
        to_lang: 'es',
        medium: 'text',
        on_data: on_data,
        on_end: on_end, 
        on_error: on_error 
      };
      msFetchTranslation(fetch_options);
    });

    it.skip("should return a URL of an audio stream", function(){
      var fetched_translation = msFetchTranslation('hello', 'en', 'es', 'audio');
      expect(fetched_translation).to.be.a('string');
    });
  });
});
