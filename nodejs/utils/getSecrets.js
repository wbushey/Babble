"use strict";

/**
 * Retrive secret variables; variables we do not want to commit to git
 * @param {string} secret_name Name of the secret variable you want
 */
exports.getSecret = function(secret_name){
  var val = null;
  if (process.env.TRAVIS){
    console.log(JSON.stringify(process.env, null, 4));
    val = process.env[secret_name];
  } else {
    var secrets = require('./secret.js');
    val = secrets[secret_name];
  }
  if (val === null){
    console.log(secret_name + ' is null for some reason');
  }
  console.log(secret_name + ': ' + val);
  return val;
};
