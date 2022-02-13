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
    var links = document.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
        console.log(links[i])
    }
    if (target.tagName.toLowerCase() == "a") {
        if (hasOnlyOneWithText(links, target.text)) {
            console.log("$(By.linkText('" + target.text + "'))")
        }
    }
    var allElements = document.getElementsByTagName("*")
    if (hasOnlyOneWithText(allElements, target.text)) {
        console.log("$(withText('" + target.text + "'))")
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
    if (target.tagName.toLowerCase() == "a") {
        if (hasOnlyOneWithText(links, target.text)) {
            console.log("driver.findElement(By.linkText('" + target.text + "'))")
        }
    }
}

function hasOnlyOne(elementList) {
    return elementList.length == 1;
}

function hasOnlyOneWithText(elementList, text) {
    var foundCount = 0;
    for (let i = 0; i < elementList.length; i++) {
        if (elementList[i].text != undefined && elementList[i].text.localeCompare(text) == 0) {
            foundCount++
            if (foundCount > 1) {
                return false
            }

        }
    }
    return foundCount == 1
}