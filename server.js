import { WebSocketServer } from 'ws';
import * as http from 'http'
import * as fs from 'fs'
import * as mime from 'mime-types'
import 'escape-html'
import * as cp from 'child_process'
import * as ps from 'ps-node'
import escapeHTML from 'escape-html';

var mcServer
var sendCommanRegexp = /^sendCommand:(\/.+)/

//path to the minecraft server latest.log
var mcLogPath = './mcserver/logs/latest.log'
const PORT=80; 

//webserver handling returns are used to skip the rest of the js to not crash
var webApp = function (req, res) {
    //returns index.html when no content is specified
    if (req.url == '/'){
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
};

//ping function to check if the connection was shut down non cleanly
var ping = function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
    
        ws.isAlive = false;
        ws.ping(noop);
    });
}


//websocketserver
//do not remove this please
function noop() {}

function heartbeat() {
    this.isAlive = true;
  }

var wsOnConnect = function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function incoming(message) {
        console.log('incoming websocket message: '+message.toString()+' \nregexp test: '+message.toString().match(sendCommanRegexp))

        let messageArray = message.toString().split(':')

        console.log("messagearray:" + messageArray)

        switch(messageArray[0]){
            case "startServer":
                console.log("starting minecraftserver")
                wss.clients.forEach(function each(ws) {
                    ws.send('clearLog')
                })

                mcServer = cp.exec('java -jar server.jar',{cwd: './mcserver'},
                
                

                function (error, stdout, stderr){
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);

                    if(error !== null){
                    console.log('exec error: ' + error);
                    }
                });

                mcServer.stdout.on('data',( data ) => {
                    wss.clients.forEach(function each(ws) {
                        ws.send(escapeHTML(data))
                    });
                })

                break
            case "stopServer":
                console.log("killing minecraftserver")
                try{
                    //finds java running with the argument -jar and kills it
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
                                            console.error(new Error( err ))
                                        }
                                        else {
                                            console.log( 'Process %s has been killed without a clean-up!', pid );
                                        }
                                    });
                                }
                            });
                        });

                    //kills the shell instance that ran the java command
                    mcServer.kill()
                    }
                catch{}
                break
            case "sendCommand":
                console.log("here")
                let sC = message.toString().match(sendCommanRegexp)
                try{
                mcServer.stdin.write(sC[1]+'\n')
                }
                catch(error){
                    console.log(error)
                }
                break;
        }
    });
    ws.send(fs.readFile(mcLogPath, function (err, data){
        if (err) {
            console.log(err)
            console.log(req.url)
        }
        ws.send(escapeHTML(data));
    }));
}

var server = http.createServer(webApp)

const wss = new WebSocketServer({ server });

wss.on('connection', wsOnConnect);

const interval = setInterval(ping , 30000);

//starts the server listener

server.listen(PORT);

console.log('Node.js web server at port '+PORT.toString()+' is running..');