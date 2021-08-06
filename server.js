var http = require('http');
var fs = require('fs');
var mime = require('mime-types');

var mcLogPath = './mcserver/logs/latest.log'
const PORT=80; 

var server = http.createServer(function (req, res) {
    //used to get the log for the minecraft server
    if (req.url == '/mclog'){
        fs.readFile(mcLogPath, function (err, data){
            if (err) {
                console.log(err)
                console.log(req.url)
                res.writeHead(404);
                return res.end("Found'nt");
            }
            res.setHeader("Content-Type", mime.lookup(req.url));
            res.writeHead(200);
            return res.end(data);
        });
        return;

    }
    //returns index html when no content is specified
    else if (req.url == '/'){
        req.url = '/index.html'
    }

    fs.readFile('http'+req.url, function (err, data) {
        if (err) {
            console.log(err)
            console.log(req.url)
            res.writeHead(404);
            return res.end("File not found.");
        }    
        res.setHeader("Content-Type", mime.lookup(req.url));
        res.writeHead(200);
        res.end(data);
    });
});

server.listen(PORT);

console.log('Node.js web server at port '+PORT.toString()+' is running..');