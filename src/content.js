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
    var elementsByTagName = document.getElementsByTagName(target.tagName);
    if (hasOnlyOne(elementsByTagName)) {
        console.log("$(By.tagName('" + target.tagName + "'))")
    }
    if (target.tagName == "a") {
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
    if (hasOnlyOne(elementsByTagName)) {
        console.log("driver.findElement(By.tagName('" + target.tagName + "'))")
    }
}

function hasOnlyOne(elementList) {
    return elementList.length == 1;
}