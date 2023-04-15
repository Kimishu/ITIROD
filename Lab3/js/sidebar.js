function getNav(){
    if(document.getElementById("side_nav").style.width == "0px"){
        document.getElementById("side_nav").style.width = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.6)";
    }
    else {
        document.getElementById("side_nav").style.width = "0px";
        document.body.style.backgroundColor = "white";
    }
}