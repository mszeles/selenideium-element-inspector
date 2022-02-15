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
    if (target.tagName.toLowerCase() == "a") {
        if (hasOnlyOneWithText(links, target.text)) {
            console.log("$(By.linkText('" + target.text + "'))")
        }
    }
    var allElements = document.getElementsByTagName("*")
    if (hasOnlyOneWithText(allElements, target.text)) {
        console.log("$(withText('" + target.text + "'))")
    }
    console.log("$('" + getCssSelector(target) + "'))")

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
    console.log("driver.findElement(By.cssSelector('" + getCssSelector(target) + "'))")
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

// Source: https://stackoverflow.com/questions/3620116/get-css-path-from-dom-element
function getCssSelector(e) {
    if (!(e instanceof Element)) {
        return;
    }
    var path = [];
    while (e.nodeType === Node.ELEMENT_NODE) {
        var selector = e.nodeName.toLowerCase();
        if (e.id) {
            selector += '#' + e.id;
            path.unshift(selector);
            break;
        } else {
            var sib = e, nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() == selector)
                   nth++;
            }
            if (nth != 1)
                selector += ":nth-of-type("+nth+")";
        }
        path.unshift(selector);
        e = e.parentNode;
    }
    return path.join(" > ");
 }