var log = document.getElementById("log")

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

//fetches the lates.log from the webserver at the beginnig
fetch('mclog')
        .then(response => response.text())
        .then(data => updateLog(data));

//fetches the log every second
setInterval(function(){
    fetch('mclog')
        .then(response => response.text())
        .then(data => updateLog(data));
},1000);

//parses minecraft log, adds code highlighting and updates the content on the webpages
function updateLog(mcLog){
    //split mclog string by linebreaks
    mcLog = mcLog.split(LineBreakRegexp)

    //checks if the lenght of the array
    if (oldLenght == mcLog.length){
        return
    }

    let isBottom = atBottom(scrollBox);

    oldLenght = mcLog.length;
    //iterates over the array adding code highligting
    for (let i = 0; i < mcLog.length; i++) {
        var logLevel = mcLog[i].match(LogLevelRegexp)
        console.log(scrollBox.scrollTop)
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
            mcLog[i] = '<span class="error">'+mcLog[i]+"</span>"
        }
    }
    //turns the array into a string by joining at linebreks
    log.innerHTML = mcLog.join("\n")
    console.log(isBottom)

    //scrolls to the bottom of the page
    if(isBottom){
        scrollBox.scrollTop = scrollBox.scrollHeight;
    }
}