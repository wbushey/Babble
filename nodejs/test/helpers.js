// Modify the Socket and it's action listeners for the purposes of these tests
// Includes making it print what it recieves to the console
var testify = function(a_client, a_name){
  var self = a_client;
  self.name = a_name;
  self.data = null;
  self.action = null;
  self.type = "";
  var output = function(data, action){
    self.data = JSON.parse(data);
    self.action = action;
    console.log(self.type + " " + self.name + " received action '" + self.action + "' with data:");
    console.log(JSON.stringify(self.data, null, 4));
  }
  self.output = output;
  
  if (typeof self.on === 'function'){
    self.on('join', function(data){output(data, 'join');});
    self.on('new message', function(data){output(data, 'new message');});
    self.on('leave', function(data){output(data, 'leave');});
  }
  return self;
};
exports.testify = testify;

// Convience function for clearing what the client has received
exports.clear = function(a_client){
  a_client.data = null;
  a_client.action = null;
}

exports.createDummyClientSocket = function(a_name, a_socket){
  var dummyClientSocket = a_socket ? a_socket : new function(){}();
  dummyClientSocket = testify(dummyClientSocket, a_name);
  dummyClientSocket.type = 'Dummy Client Socket';
  return dummyClientSocket;
}

exports.createDummyServerSocket = function(a_name){
  var dummyServerSocket = new function(){}();
  dummyServerSocket = testify(dummyServerSocket, a_name);
  dummyServerSocket.type = 'Dummy Server Socket';
  dummyServerSocket.emit = function(action, data){
    dummyServerSocket.output(data, action);
  }
  dummyServerSocket.real_emit = dummyServerSocket.emit;
  return dummyServerSocket;
};
