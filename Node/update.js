var https = require('https');
var fs = require('fs');

module.exports {
    updateFile: function (filename, url) {

        var file = fs.createWriteStream(filename);
        var request = https.get(url, function(response) {
            response.pipe(file);
        }
    }
}