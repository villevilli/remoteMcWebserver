var xhr
function authRight(id){
    console.log("LibLeft")
    element=document.getElementById(id)
    password=element.value

    xhr = new XMLHttpRequest();
    //xhr.open("POST", location.href, true,null,password);
    xhr.open("GET", location.href, true);
    xhr.addEventListener("load",loadpage)
    xhr.setRequestHeader("Authorization", "Basic"+ btoa("admin"+":"+password))
    //xhr.setRequestHeader('Content-Type', 'text');
    xhr.send(null);
}
function loadpage(){
    if(xhr.status=200){
        location.reload()
    }
}