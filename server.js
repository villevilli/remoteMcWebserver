var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var escape = require('escape-html');

var cp = require('child_process')
var ps = require('ps-node');
var mcServer

//path to the minecraft server latest.log
var mcLogPath = './mcserver/logs/latest.log'
const PORT=80; 

//webserver handling returns are used to skip the rest of the js to not crash
var server = http.createServer(function (req, res) {
    //returns the log file as text
    if (req.url == '/api/mclog'){
        fs.readFile(mcLogPath, function (err, data){
            if (err) {
                console.log(err)
                console.log(req.url)
                res.writeHead(404);
                return res.end("Found'nt");
            }
            res.setHeader("Content-Type", mime.lookup(req.url));
            res.writeHead(200);
            return res.end(escape(data));
        });
        return;

    }
    //handles other api calls than the mclog
    if (req.url.startsWith('/api/')){
        switch(req.url){
            case "/api/startserver/":
                mcServer = cp.exec('java -jar server.jar',{cwd: './mcserver'},
                function (error, stdout, stderr){
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);

                    if(error !== null){
                    console.log('exec error: ' + error);
                    }
                });
                break;
            case "/api/stopserver/":

                //kills the server process and since it crashed the webserver if no minecraft server was running i added the try except
                try{
                    ps.lookup({
                        command: 'java',
                        arguments: '-jar',
                        }, function(err, resultList ) {
                            if (err) {
                                throw new Error( err );
                            }
                        
                            resultList.forEach(function( process ){
                                if( process ){
                                    ps.kill( process.pid, function( err ) {
                                        if (err) {
                                            throw new Error( err );
                                        }
                                        else {
                                            console.log( 'Process %s has been killed without a clean-up!', pid );
                                        }
                                    });
                                }
                            });
                        });
                    }
                catch{}
                break;
            case "/api/serverstatus/":
                //return serverstatus
                break;
            default:
                //404
        }
        return;

    }
    //returns index.html when no content is specified
    else if (req.url == '/'){
        req.url = '/index.html'
    }

    //looks for the file specified in the url relative to the /http/ folder
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



//starts the server listener
server.listen(PORT);

console.log('Node.js web server at port '+PORT.toString()+' is running..');