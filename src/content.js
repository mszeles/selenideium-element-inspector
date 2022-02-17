window.onclick = function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    console.log(target)
    var selenideSelectors = []
    var seleniumSelectors = []
    if (target.hasAttribute("id")) {
        selenideSelectors.push(createSelenideSelector("By.id('" + target.getAttribute("id") + "')"))
        seleniumSelectors.push(createSeleniumSelector("By.id('" + target.getAttribute("id") + "')"))
    }
    if (target.hasAttribute("name")) {
        var elementsByName = document.getElementsByName(target.getAttribute("name"))
        if (hasOnlyOne(elementsByName)) {
            selenideSelectors.push(createSelenideSelector("By.id('" + target.getAttribute("id") + "')"))
            seleniumSelectors.push(createSeleniumSelector("By.id('" + target.getAttribute("id") + "')"))
        }
    }
    var elementsByTagName = document.getElementsByTagName(target.tagName)
    if (hasOnlyOne(elementsByTagName)) {
        selenideSelectors.push(createSelenideSelector("By.tagName('" + target.tagName.toLowerCase() + "')"))
        seleniumSelectors.push(createSeleniumSelector("By.tagName('" + target.tagName.toLowerCase() + "')"))
    }
    var links = document.getElementsByTagName("a")
    if (target.tagName.toLowerCase() == "a") {
        if (hasOnlyOneWithText(links, target.text)) {
            selenideSelectors.push(createSelenideSelector("By.linkText('" + target.text + "')"))
            seleniumSelectors.push(createSeleniumSelector("By.linkText('" + target.text + "')"))
        }
    }
    var allElements = document.getElementsByTagName("*")
    if (hasOnlyOneWithText(allElements, target.text)) {
        selenideSelectors.push(createSelenideSelector("withText('" + target.text + "')"))
    }
    selenideSelectors.push(createSelenideSelector("'" + getCssSelector(target) + "'"))
    seleniumSelectors.push(createSeleniumSelector("'" + getCssSelector(target) + "'"))

    collectAttributeBasedSelectors(target, selenideSelectors, seleniumSelectors)

    console.log("Selenide")
    for (let i = 0; i < selenideSelectors.length; i++) {
        console.log(selenideSelectors[i])
    }
    console.log("Selenium")
    for (let i = 0; i < seleniumSelectors.length; i++) {
        console.log(seleniumSelectors[i])
    }
}

function collectAttributeBasedSelectors(element, selenideSelectors, seleniumSelectors) {
    var attributes = element.attributes
    for (let i = 0; i < attributes.length; i++) {
        var nodeName = attributes[i].nodeName.toLowerCase()
        if (nodeName != 'id' && nodeName != 'class' && nodeName != 'name') {
            var cssSelector = element.tagName.toLowerCase() + "[" + nodeName + " = '" + escape(attributes[i].nodeValue) + "']"
            console.log(cssSelector)
            var allElements = document.querySelectorAll(cssSelector)
            if (hasOnlyOne(allElements)) {
                selenideSelectors.push(createSelenideSelector("'" + cssSelector + "'"))
                seleniumSelectors.push(createSeleniumSelector("'" + cssSelector + "'"))
            }
        }
    }
}

function createSelenideSelector(selector) {
    return "$(" + selector + ");"
}

function createSeleniumSelector(selector) {
    return "driver.findElement(" + selector + ");"
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
function getCssSelector(element) {
    if (!(element instanceof Element)) {
        console.log("Element is not an Element: " + element)
        return;
    }
    var path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
        var selector = element.nodeName.toLowerCase();
        if (element.id) {
            selector += '#' + element.id;
            path.unshift(selector);
            break;
        } else {
            var previousSibling = element, nth = 1;
            while (previousSibling = previousSibling.previousElementSibling) {
                if (previousSibling.nodeName.toLowerCase() == selector)
                   nth++;
            }
            if (nth != 1)
                selector += ":nth-of-type("+nth+")";
        }
        path.unshift(selector);
        element = element.parentNode;

    }
    return path.join(" > ");
 }