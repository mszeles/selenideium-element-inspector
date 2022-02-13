document.onclick = function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    console.log(target)
    console.log("Selenide")
    if (target.hasAttribute("id")) {
        console.log("$(By.id('" + target.getAttribute("id") + "'))")
    }
   if (target.hasAttribute("name")) {
        var elementsByName = document.getElementsByName(target.getAttribute("name"));
        if (hasOnlyOne(elementsByName)) {
            console.log("$(By.name('" + target.getAttribute("name") + "'))")
        }
    }
    console.log("Selenium")
    if (target.hasAttribute("id")) {
        console.log("driver.findElement(By.id('" + target.getAttribute("id") + "'))")
    }
    if (target.hasAttribute("name")) {
        var elementsByName = document.getElementsByName(target.getAttribute("name"));
        if (hasOnlyOne(elementsByName)) {
            console.log("driver.findElement(By.name('" + target.getAttribute("name") + "'))")
        }
    }
}

function hasOnlyOne(elementList) {
    return elementList.length == 1;
}