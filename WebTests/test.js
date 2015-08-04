if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        function pad(n) { return n < 10 ? '0' + n : n; }
        function ms(n) { return n < 10 ? '00'+ n : n < 100 ? '0' + n : n }
        return this.getFullYear() + '-' +
            pad(this.getMonth() + 1) + '-' +
            pad(this.getDate()) + 'T' +
            pad(this.getHours()) + ':' +
            pad(this.getMinutes()) + ':' +
            pad(this.getSeconds()) + '.' +
            ms(this.getMilliseconds()) + 'Z';
    }
}

function createHAR(address, title, startTime, resources)
{
    var entries = [];
    resources.forEach(function (resource) {

        var request = resource.request,
            startReply = resource.startReply,
            endReply = resource.endReply;

        if (!request || !startReply || !endReply) {
            return;
        }

        // Exclude Data URI from HAR file because
        // they aren't included in specification
        if (request.url.match(/(^data:image\/.*)/i)) {
            return;
        }

        //console.log(JSON.stringify(resource, undefined, 4));
        entries.push({
            startedDateTime: new Date(request.time),
            time: (new Date(endReply.time)) - (new Date(request.time)),
            request: {
                method: request.method,
                url: request.url,
                httpVersion: "HTTP/1.1",
                cookies: [],
                headers: request.headers,
                queryString: [],
                headersSize: -1,
                bodySize: -1
            },
            response: {
                status: endReply.status,
                statusText: endReply.statusText,
                httpVersion: "HTTP/1.1",
                cookies: [],
                headers: endReply.headers,
                redirectURL: "",
                headersSize: -1,
                bodySize: startReply.bodySize,
                content: {
                    size: startReply.bodySize,
                    mimeType: endReply.contentType
                }
            },
            cache: {},
            timings: {
                blocked: 0,
                dns: -1,
                connect: -1,
                send: 0,
                wait: (new Date(startReply.time)) - (new Date(request.time)),
                receive: (new Date(endReply.time)) - (new Date(startReply.time)),
                ssl: -1
            },
            pageref: address
        });
    });

    return {
        log: {
            version: '1.2',
            creator: {
                name: "PhantomJS",
                version: '2.0'
            },
            pages: [{
                startedDateTime: startTime.toISOString(),
                id: address,
                title: title,
                pageTimings: {
                    onLoad: (new Date(page.endTime)) - (new Date(page.startTime))
                }
            }],
            entries: entries
        }
    };
}



var Nightmare = require('nightmare');

var page = {title: "Test Title", address: "http://www.yahoo.com"};
    page.resources = [];
    page.times = new Object();
    page.times.start = [];
    page.times.end = [];
    page.times.url = [];
    
new Nightmare()
  .on('resourceReceived', function (res) {
        if (res.stage === 'start') {
            page.resources[res.id].startReply = res;
        }
        if (res.stage === 'end') {
            page.resources[res.id].endReply = res;
        }
    })
  .on('resourceRequested', function (req) {
        page.resources[req.id] = {
            request: req,
            startReply: null,
            endReply: null
        };
    })
  .on('loadStarted', function () {
        page.startTime = new Date();
        page.times.start.push(new Date());
        // make startTime and endTime arrays
        // check if endTime < next request time, create new HAR group
    })
  .on('loadFinished', function () {
        page.endTime = new Date();
        page.times.end.push(new Date());
    })
  .on('urlChanged', function() {
        page.times.url.push(new Date());
    })
  .goto('https://qa.admin2.talentportal.ddiworld.com')
    .type('#UserName', 'automation@test.com')
    .type('#Password', 'automation1')
    .click('#logon-button')
    .wait()
    .run(function (err, nightmare) {
      if (err) {
        return console.log(err);
      } else {
            //har = createHAR(nightmare.url, nightmare.title, page.startTime, page.resources);
            //console.log(JSON.stringify(har, undefined, 4));
            console.log("Total page load started = " + page.times.start.length);
            for (var j = 0; j < page.times.start.length; j++)
            {
                console.log("Start: " + page.times.start[j]);
                console.log("End: " + page.times.end[j]);
                console.log("Url: " + page.times.url[j]);
                console.log("Total time to load = " + ((new Date(page.times.end[j])) - (new Date(page.times.start[j]))));
            }
      }
    });