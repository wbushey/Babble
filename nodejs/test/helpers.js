// Modify the Socket and it's action listeners for the purposes of these tests
// Includes making it print what it recieves to the console
exports.testify = function(a_client, a_name){
  var self = a_client;
  self.name = a_name;
  var output = function(data){
    self.emitted = JSON.parse(data);
    console.log("Client Socket " + self.name + " recevied: ");
    console.log(JSON.stringify(self.emitted, null, 4));
  }
  
  self.on('join', output);
  self.on('new message', output);
  self.on('leave', output);
  return self;
};

// Convience function for clearing client 'output'
exports.clear_emitted = function(a_client){
  a_client.emitted = null;
}
