function getNav(){
    if(document.getElementById("mySidenav").style.width == "0px"){
        document.getElementById("mySidenav").style.width = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    }
    else {
        document.getElementById("mySidenav").style.width = "0px";
        document.body.style.backgroundColor = "white";
    }
}