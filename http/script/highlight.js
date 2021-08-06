var log = document.getElementById("log")
var LogLevelRegexp = /(?:\/)(\w+)(?:][ :])/
var LineBreakRegexp = /\r?\n/
var scrollBox = document.getElementById("scrollBox")
let oldLenght = 0

console.log(scrollBox)

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

fetch('mclog')
        .then(response => response.text())
        .then(data => updateLog(data));

setInterval(function(){
    fetch('mclog')
        .then(response => response.text())
        .then(data => updateLog(data));
},1000);

function updateLog(mcLog){
    mcLog = mcLog.split(LineBreakRegexp)

    if (oldLenght == mcLog.length){
        return
    }

    let isBottom = atBottom(scrollBox);

    oldLenght = mcLog.length;

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
        catch(error){
            /*console.log(logLevel)
            console.error(error)
            console.log(mcLog)*/
            mcLog[i] = '<span class="error">'+mcLog[i]+"</span>"
        }
    }
    log.innerHTML = mcLog.join("\n")
    console.log(isBottom)
    if(isBottom){
        scrollBox.scrollTop = scrollBox.scrollHeight;
    }
}