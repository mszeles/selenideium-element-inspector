window.onclick = function(e) {
    console.log("------------- Selenideium Element Inspector -------------")
    const selectorGeneratorMap = new Map();
    selectorGeneratorMap.set("selenide", new SelenideSelectorGenerator());
    selectorGeneratorMap.set("selenium-java", new SeleniumJavaSelectorGenerator());
    selectorGeneratorMap.set("selenium-javascript", new SeleniumJavaScriptSelectorGenerator());
    selectorGeneratorMap.set("selenium-python", new SeleniumPythonSelectorGenerator());
    selectorGeneratorMap.set("selenide-csharp", new SeleniumCSharpSelectorGenerator());
    selectorGeneratorMap.set("playwright", new PlaywrightSelectorGenerator());
    selectorGeneratorMap.set("cypress", new CypressSelectorGenerator());
    selectorGeneratorMap.set("test-cafe", new SelenideSelectorGenerator());
    selectorGeneratorMap.set("selenide", new TestCafeSelectorGenerator());
    selectorGeneratorMap.set("squish", new SquishSelectorGenerator());
    let selectorGenerators = []
    selectorGeneratorMap.forEach( function(value) {
        selectorGenerators.push(value)
    })
//    $(':checkbox').each(function(index, element) {
//        let id = this.id;
//        storage.get(id, function(items) {
//            if (items[id]) {
//                console.log("Adding selector generator: " + selectorGeneratorMap.get(id))
//                selectorGenerators.push(selectorGeneratorMap.get(id))
//            }
//        })
//    })
    e = e || window.event;
    let target = e.target || e.srcElement
    console.log(target)
    for (i = 0; i < selectorGenerators.length; i++) {
        let selectorGenerator = selectorGenerators[i]
        if (target.hasAttribute("id")) {
            let id = target.getAttribute("id")
            if (selectorGenerator.hasOnlyOne(document.querySelectorAll("*#" + id))) {
                selectorGenerator.generateIdBasedSelector(id)
            }
            else {
                console.log("Warning: There are multiple elements with id: " + id)
            }
        }
        if (target.hasAttribute("name")) {
            let name = target.getAttribute("name")
            if (selectorGenerator.hasOnlyOne(document.getElementsByName(name))) {
                selectorGenerator.generateNameBasedSelector(name)
            }
        }
        if (selectorGenerator.hasOnlyOne(document.getElementsByTagName(target.tagName))) {
            selectorGenerator.generateTagNameBasedSelector(target.tagName)
        }
        let links = document.getElementsByTagName("a")
        if (target.tagName.toLowerCase() == "a") {
            if (selectorGenerator.hasOnlyOneWithText(links, target.text)) {
                selectorGenerator.generateTagNameBasedSelector(target.text)
            }
        }
        if (selectorGenerator.hasOnlyOneWithText(document.getElementsByTagName("*"), target.text)) {
            selectorGenerator.generateTextBasedSelector(target.text)
        }
        let css = selectorGenerator.getCssSelector(target)
        if (css !== null) {
            selectorGenerator.generateCssBasedSelector(css)
        }
        let xpath = selectorGenerator.getRelativeXPathSelector(target)
        if (xpath !== null) {
            selectorGenerator.generateXPathBasedSelector(xpath)
        }
        selectorGenerator.collectAttributeBasedSelectors(target)
        selectorGenerator.collectUniqueClassSelectors(target)

        console.log(selectorGenerator.getName())
        for (let i = 0; i < selectorGenerator.selectors.length; i++) {
            console.log(selectorGenerator.selectors[i])
        }
    }
}

class SelectorGenerator {
    constructor(){
        this.selectors = []
    }

    getName() {
        throw new Error('You have to implement the method!')
    }

    createSelector(selector) {
        throw new Error('You have to implement the method!')
    }

    storeSelector(selector) {
        if (selector == undefined || selector == "undefined") {
            console.log("WARNING!: Invalid selector at: ")
            console.trace()
            return
        }
        this.selectors.push(selector)
    }

    generateIdBasedSelector(id) {
        throw new Error('You have to implement the method!')
    }

    generateNameBasedSelector(name) {
        throw new Error('You have to implement the method!')
    }

    generateTagNameBasedSelector(tagName) {
        throw new Error('You have to implement the method!')
    }

    generateLinkTextBasedSelector(linkText) {
        throw new Error('You have to implement the method!')
    }

    generateTextBasedSelector(text) {
        throw new Error('You have to implement the method!')
    }

    generateCssBasedSelector(css) {
        this.storeSelector(this.createSelector("'" + css + "'"))
    }

    generateXPathBasedSelector(xPath) {
        throw new Error('You have to implement the method!')
    }

    collectAttributeBasedSelectors(element) {
        let attributes = element.attributes
        for (let i = 0; i < attributes.length; i++) {
            let nodeName = attributes[i].nodeName.toLowerCase()
            if (nodeName != 'id' && nodeName != 'class' && nodeName != 'name' &&
                attributes[i].nodeValue != null && attributes[i].nodeValue != undefined) {
                let cssSelector = element.tagName.toLowerCase() + "[" + nodeName + " = '" + escape(attributes[i].nodeValue) + "']"
                let allElements = document.querySelectorAll(cssSelector)
                if (this.hasOnlyOne(allElements)) {
                    this.generateAttributeBasedSelector(element.tagName.toLowerCase(), nodeName, escape(attributes[i].nodeValue))
                }
            }
        }
    }

    generateAttributeBasedSelector(tagName, attributeName, attributeValue) {
        return this.generateCssBasedSelector(tagName + "[" + attributeName + " = '" + attributeValue + "']")
    }

    collectUniqueClassSelectors(element) {
        let cl = element.getAttribute("class")
        if (cl == null || cl == undefined) {
            return
        }
        let classes = cl.split(" ");
        for (let i = 0; i < classes.length; i++) {
            if(classes[i] != "") {
                let cssSelector = element.tagName.toLowerCase() + "." + classes[i]
                if (this.hasOnlyOne(document.querySelectorAll(cssSelector))) {
                    this.storeSelector(this.createSelector(this.generateClassBasedSelector(element.tagName.toLowerCase(), classes[i])))
                }
            }
        }
    }

    generateClassBasedSelector(tagName, className) {
        return tagName + "." + className
    }

    hasOnlyOne(elementList) {
        return elementList.length == 1;
    }

    hasOnlyOneWithText(elementList, text) {
        let foundCount = 0;
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
    getCssSelector(element) {
        if (!(element instanceof Element)) {
            console.log("Element is not an Element: " + element)
            return;
        }
        let path = [];
        while (element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            if (element.id) {
                selector += '#' + element.id;
                path.unshift(selector);
                break;
            } else {
                let previousSibling = element, nth = 1;
                while (previousSibling = previousSibling.previousElementSibling) {
                    if (previousSibling.nodeName.toLowerCase() == selector)
                       nth++;
                }
                if (nth != 1)
                    selector += ":nth-of-type(" + nth + ")";
            }
            path.unshift(selector);
            element = element.parentNode;
            if (element === null) {
                console.log("ERROR: Cannot determine CSS selector. Please report the error by providing the URL and the element at https://github.com/mszeles/selenideium-element-inspector/issues")
                return null
            }

        }
        return path.join(" > ");
     }

     getRelativeXPathSelector(element) {
         if (!(element instanceof Element)) {
             console.log("Element is not an Element: " + element)
             return;
         }
         let path = [];
         while (element.nodeType === Node.ELEMENT_NODE) {
             let selector = element.nodeName.toLowerCase();
             if (element.id) {
                 selector += "[@id=\"" + element.id + "\"]";
                 path.unshift(selector);
                 break;
             } else {
                 let previousSibling = element, nth = 0;
                 while (previousSibling = previousSibling.previousElementSibling) {
                     if (previousSibling.nodeName.toLowerCase() == selector)
                        nth++;
                 }
                 if (nth != 0) {
                     selector += "[" + nth + "]";
                 }
             }
             path.unshift(selector);
             if (element.parentNode === null) {
                console.log("ERROR: Cannot determine XPath selector. Please report the error by providing the URL and the element at https://github.com/mszeles/selenideium-element-inspector/issues")
                return null
             }
             element = element.parentNode;

         }
         return "//" + path.join("/");
      }

}

class SelenideSelectorGenerator extends SelectorGenerator {

    getName() {
        return "Selenide"
    }

    createSelector(selector) {
        return "$(" + selector + ");"
    }

    createXPathSelector(selector) {
        return "$x(" + selector + ");"
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("By.id('" + id + "')"))
    }

    generateNameBasedSelector(name) {
        this.storeSelector(this.createSelector("By.name('" + name + "')"))
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector(this.createSelector("By.tagName('" + tagName + "')"))
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector(this.createSelector("By.linkText('" + linkText + "')"))
    }

    generateTextBasedSelector(text) {
        this.storeSelector(this.createSelector("withText('" + text + "')"))
    }

    generateXPathBasedSelector(xPath) {
        this.storeSelector(this.createXPathSelector("'" + xPath + "'"))
    }
}

class SeleniumJavaSelectorGenerator extends SelectorGenerator {

    getName() {
        return "Selenium Java"
    }

    createSelector(selector) {
        return "driver.findElement(" + selector + ");"
    }

    createXPathSelector(selector) {
        return "driver.findElement(By.xpath(" + selector + "));"
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("By.id('" + id + "')"))
    }

    generateNameBasedSelector(name) {
        this.storeSelector(this.createSelector("By.name('" + name + "')"))
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector(this.createSelector("By.tagName('" + tagName + "')"))
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector(this.createSelector("By.linkText('" + linkText + "')"))
    }

    generateTextBasedSelector(text) {
    }

    generateXPathBasedSelector(xPath) {
        this.storeSelector(this.createXPathSelector("'" + xPath + "'"))
    }
}

class SeleniumPythonSelectorGenerator extends SelectorGenerator {

    getName() {
        return "Selenium Python"
    }

    createSelector(selector) {
        return "driver." + selector
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("find_element_by_id('" + id + "')"))
    }

    generateNameBasedSelector(name) {
        this.storeSelector(this.createSelector("find_element_by_name('" + name + "')"))
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector(this.createSelector("find_element_by_tag_name('" + tagName + "')"))
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector(this.createSelector("find_element_by_link_text('" + linkText + "')"))
    }

    generateTextBasedSelector(text) {
    }

    generateCssBasedSelector(css) {
        this.storeSelector(this.createSelector("find_element_by_css_selector('" + css + "')"))
    }

    generateXPathBasedSelector(xPath) {
        this.storeSelector(this.createSelector("find_element_by_xpath('" + xPath + "')"))
    }
}

class SeleniumCSharpSelectorGenerator extends SelectorGenerator {

    getName() {
        return "Selenium C#"
    }

    createSelector(selector) {
        return "driver.FindElement(" + selector + ");"
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("By.Id('" + id + "')"))
    }

    generateNameBasedSelector(name) {
        this.storeSelector(this.createSelector("By.Name('" + name + "')"))
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector(this.createSelector("By.TagName('" + tagName + "')"))
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector(this.createSelector("By.LinkText('" + linkText + "')"))
    }

    generateTextBasedSelector(text) {
    }

    generateCssBasedSelector(css) {
        this.storeSelector(this.createSelector("By.CssSelector('" + css + "')"))
    }

    generateXPathBasedSelector(xPath) {
        this.storeSelector(this.createSelector("By.XPath('" + xPath + "')"))
    }
}

class SeleniumJavaScriptSelectorGenerator extends SelectorGenerator {

    getName() {
        return "Selenium JavaScript"
    }

    createSelector(selector) {
        return "driver.findElement(" + selector + ");"
    }

    createXPathSelector(selector) {
        return "driver.findElement(By.xpath(" + selector + "));"
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("By.id('" + id + "')"))
    }

    generateNameBasedSelector(name) {
        this.storeSelector(this.createSelector("By.name('" + name + "')"))
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector(this.createSelector("By.tagName('" + tagName + "')"))
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector(this.createSelector("By.linkText('" + linkText + "')"))
    }

    generateTextBasedSelector(text) {
    }

    generateCssBasedSelector(css) {
        this.storeSelector(this.createSelector("By.css('" + css + "')"))
    }

    generateXPathBasedSelector(xPath) {
        this.storeSelector(this.createSelector("By.xpath('" + xPath + "')"))
    }
}

class CypressSelectorGenerator extends SelectorGenerator {

    getName() {
        return "Cypress"
    }

    createSelector(selector) {
        return "cy.get('" + selector + "')"
    }

    createXPathSelector(selector) {
        return "cy.xpath('" + selector + "')"
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("#" + id))
    }

    generateNameBasedSelector(name) {
        this.storeSelector(this.createSelector("*[name=\"" + name + "\"]"))
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector(this.createSelector(tagName))
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector(this.createSelector("a:contains(\"" + linkText + "\")"))
    }

    generateTextBasedSelector(text) {
    }

    generateCssBasedSelector(css) {
        this.storeSelector(this.createSelector(css))
    }

    generateXPathBasedSelector(xPath) {
        this.storeSelector(this.createXPathSelector(xPath))
    }
}

class TestCafeSelectorGenerator extends SelectorGenerator {

    getName() {
        return "TestCafe"
    }

    createSelector(selector) {
        return "Selector('" + selector + "')"
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("#" + id))
    }

    generateNameBasedSelector(name) {
        this.storeSelector("Selector('*[name=" + name + "'])")
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector("Selector('" + tagName + "')")
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector("Selector('a').withText('" + text + "')")
    }

    generateTextBasedSelector(text) {
        this.storeSelector("Selector('*').withText('" + text + "')")
    }

    generateCssBasedSelector(css) {
        this.storeSelector(this.createSelector(css))
    }

    generateXPathBasedSelector(xPath) {
    }
}

class PlaywrightSelectorGenerator extends SelectorGenerator {

    getName() {
        return "Playwright"
    }

    createSelector(selector) {
        return "await page.locator('" + selector + "')";
    }

    createXPathSelector(selector) {
        return "element." + selector;
    }

    generateAttributeBasedSelector(tagName, attributeName, attributeValue) {
        return this.generateCssBasedSelector(tagName + "[" + attributeName + " = \"" + attributeValue + "\"]")
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("id=" + id))
    }

    generateNameBasedSelector(name) {
        this.storeSelector(this.createSelector("name=\"" + name + "\""))
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector(this.createSelector(tagName))
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector(this.createSelector("a[text=\"" + text + "\"]"))
    }

    generateTextBasedSelector(text) {
        this.storeSelector(this.createSelector("text=\"" + text + "\""))
    }

    generateCssBasedSelector(css) {
        this.storeSelector(this.createSelector(css))
    }

    generateXPathBasedSelector(xPath) {
        this.storeSelector(this.createSelector("xpath=" + xPath))
    }
}

class SquishSelectorGenerator extends SelectorGenerator {

    getName() {
        return "Squish"
    }

    generateAttributeBasedSelector(tagName, attributeName, attributeValue) {
        return this.storeSelector(this.createSelector("{tagName='" + tagName + "', " + attributeName + "='" + attributeValue + "'}"))
    }

    createSelector(selector) {
        if (selector == undefined || selector == "undefined") {
            console.log("WARNING!: Invalid selector at:")
            console.trace()
        }
        return "findObject(\"" + selector + "\")";
    }

    createXPathSelector(selector) {
        return "self.container." + selector;
    }

    generateIdBasedSelector(id) {
        this.storeSelector(this.createSelector("{id='" + id + "'}"))
    }

    generateNameBasedSelector(name) {
        this.storeSelector(this.createSelector("{name='" + name + "'}"))
    }

    generateTagNameBasedSelector(tagName) {
        this.storeSelector(this.createSelector("{tagName='" + tagName + "'}"))
    }

    generateLinkTextBasedSelector(linkText) {
        this.storeSelector(this.createSelector("{tagName='a', innerText='" + linkText + "'}"))
    }

    generateTextBasedSelector(text) {
        this.storeSelector(this.createSelector("{innerText='" + text + "'}"))
    }

    generateCssBasedSelector(css) {
    }

    generateXPathBasedSelector(xPath) {
        this.storeSelector(this.createXPathSelector("evaluateXPath('" + xPath + "')"))
    }
}
