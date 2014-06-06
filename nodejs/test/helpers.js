// Modify the Socket and it's action listeners for the purposes of these tests
// Includes making it print what it recieves to the console
exports.testify = function(a_client, a_name){
  var self = a_client;
  self.name = a_name;
  self.data = null;
  self.action = null;
  var output = function(data, action){
    self.data = JSON.parse(data);
    self.action = action;
    console.log("Client Socket " + self.name + " received action '" + self.action + "' with data:");
    console.log(JSON.stringify(self.data, null, 4));
  }
  
  if (typeof self.on === 'function'){
    self.on('join', function(data){output(data, 'join');});
    self.on('new message', function(data){output(data, 'new message');});
    self.on('leave', function(data){output(data, 'leave');});
  }
  return self;
};

// Convience function for clearing what the client has received
exports.clear = function(a_client){
  a_client.data = null;
  a_client.action = null;
}
