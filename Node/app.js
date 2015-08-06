var update = require("./update");

// run each function for webtest
// do update function (ask for list of files, replace them)

//setInterval(item.run(), 30000);

// update stuff
function runUpdate()
{
    var files = getJson("update url");
    files.forEach(function (file) {
        update.updateFile(file.fileName, file.url);
    });
}
    
function getJson(url)
{
    var files = [];
    files.push({fileName: "update.js", url: "https://raw.githubusercontent.com/uugengiven/DistributedWebTest/master/Node/update.js"});
    files.push({fileName: "app.js", url: "https://raw.githubusercontent.com/uugengiven/DistributedWebTest/master/Node/app.js"});
    return files;
}

// - get list of files
// - run update.updateFile(filename, urls);

runUpdate();
console.log("done?");