document.onclick = function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    console.log(e)
}