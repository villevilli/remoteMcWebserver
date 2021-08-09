var log = document.getElementById("log")

var domainName = location.host

var serverSocket = new WebSocket("ws://"+domainName+"/")

//finds the loglevel of an mc log
var LogLevelRegexp = /(?:\/)(\w+)(?:][ :])/

//finds the linebreaks by all oses aka lf(superior linux) and crlf(inferiror windows)
var LineBreakRegexp = /\r?\n/

var scrollBox = document.getElementById("scrollBox")
let oldLenght = 0

console.log(scrollBox)

//used to check if an element has been scrolled to the bottom
function atBottom(ele) {
    var sh = ele.scrollHeight;
    var st = ele.scrollTop;
    var ch = ele.clientHeight;
    console.log(sh - ch,st)
    if(ch==0) {
        return true;
    }
    if(st == sh - ch)
        {return true;} 
    else 
        {return false;}
}

serverSocket.onmessage = function(event){
    console.log(event.data)
    if(event.data == 'clearLog'){
        log.innerHTML = ''
        console.log('log cleared')
    }
    else{
        updateLog(event.data)
    }

}

function enterPress(commands){
    tempElement = document.getElementById(commands)
    if (event.key == 'Enter'){
        console.log(tempElement.value[0])
        if (tempElement.value[0] != '/'){
            tempElement.value = '/'+tempElement.value
        }
        sendCommand(tempElement.value)
        tempElement.value = ''
    }
}

function startServer(){
    serverSocket.send("startServer")
}

function stopServer(){
    serverSocket.send("stopServer")
}

function sendCommand(cmd){
    console.log(cmd)
    console.log(serverSocket.send("sendCommand:"+cmd))
}

//parses minecraft log, adds code highlighting and updates the content on the webpages
function updateLog(mcLog){
    //split mclog string by linebreaks
    mcLog = mcLog.split(LineBreakRegexp)

    let isBottom = atBottom(scrollBox);

    oldLenght = mcLog.length;
    //iterates over the array adding code highligting
    for (let i = 0; i < mcLog.length; i++) {
        var logLevel = mcLog[i].match(LogLevelRegexp)
        try{
            switch (logLevel[1]){
                case "INFO":
                    mcLog[i] = '<span class="info">'+mcLog[i]+"</span>"
                    break;
                case "WARN":
                    mcLog[i] = '<span class="warning">'+mcLog[i]+"</span>"
                    break;
                case "ERROR":
                    mcLog[i] = '<span class="error">'+mcLog[i]+"</span>"
                    break;
            }
        }
        //makes it not crash on things like empty lines
        catch(error){
            /*console.log(logLevel)
            console.error(error)
            console.log(mcLog)*/
            if (mcLog[i] != ''){
                mcLog[i] = '<span class="error">'+mcLog[i]+"</span>"
            }
        }
    }
    //turns the array into a string by joining at linebreks
    if(typeof(mcLog == Array)){
        log.innerHTML = log.innerHTML + mcLog.join("\n")
    }
    //scrolls to the bottom of the page
    if(isBottom){
        scrollBox.scrollTop = scrollBox.scrollHeight;
    }
}