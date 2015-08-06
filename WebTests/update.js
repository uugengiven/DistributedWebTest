var http = require('http');
var fs = require('fs');

var file = fs.createWriteStream("update.js");
var request = http.get("https://raw.githubusercontent.com/uugengiven/DistributedWebTest/master/WebTests/update.js", function(response) {
  response.pipe(file);
});