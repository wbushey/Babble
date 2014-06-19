"use strict";

/**
 * Retrive secret variables; variables we do not want to commit to git
 * @param {string} secret_name Name of the secret variable you want
 */
exports.getSecret = function(secret_name){
  var val = null;
  if (process.env.TRAVIS){
    val = process.env[secret_name];
  } else {
    var secrets = require('./secret2.js');
    val = secrets[secret_name];
  }
  if (!val){
    console.log(secret_name + ' is not defined for some reason');
  }
  return val;
};
