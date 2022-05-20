import getObjectFromLocalStorage from "./utils/get-object-from-local-storage";

async function collectSelectorGenerators(
  generatorMap: Map<string, SelectorGenerator>
) {
  let selectorGenerators: SelectorGenerator[] = [];
  for (const [key, value] of generatorMap) {
    await collectSelectorGenerator(selectorGenerators, key, value);
  }
  return selectorGenerators;
}

async function collectSelectorGenerator(
  selectorGenerators: SelectorGenerator[],
  key: string,
  value: SelectorGenerator
) {
  let settingsValue = await getObjectFromLocalStorage(key);
  if (settingsValue != false) {
    selectorGenerators.push(value);
  }
}

window.onclick = async function (e) {
  console.log("------------- Selenideium Element Inspector -------------");
  let selectorGeneratorMap = new Map<string, SelectorGenerator>();
  selectorGeneratorMap.set("selenide", new SelenideSelectorGenerator());
  selectorGeneratorMap.set(
    "selenium-java",
    new SeleniumJavaSelectorGenerator()
  );
  selectorGeneratorMap.set(
    "selenium-javascript",
    new SeleniumJavaScriptSelectorGenerator()
  );
  selectorGeneratorMap.set(
    "selenium-python",
    new SeleniumPythonSelectorGenerator()
  );
  selectorGeneratorMap.set(
    "selenium-csharp",
    new SeleniumCSharpSelectorGenerator()
  );
  selectorGeneratorMap.set("playwright", new PlaywrightSelectorGenerator());
  selectorGeneratorMap.set("cypress", new CypressSelectorGenerator());
  selectorGeneratorMap.set("test-cafe", new TestCafeSelectorGenerator());
  selectorGeneratorMap.set("squish", new SquishSelectorGenerator());
  let selectorGenerators = await collectSelectorGenerators(
    selectorGeneratorMap
  );
  e = e || window.event;
  let target = (e.target || e.srcElement) as Element;
  console.log(target);
  for (let i = 0; i < selectorGenerators.length; i++) {
    let selectorGenerator = selectorGenerators[i];
    if (target.hasAttribute("id")) {
      let id = target.getAttribute("id");
      if (
        id &&
        selectorGenerator.hasOnlyOne(document.querySelectorAll("*#" + id))
      ) {
        selectorGenerator.generateIdBasedSelector(id);
      } else {
        console.log("Warning: There are multiple elements with id: " + id);
      }
    }
    if (target.hasAttribute("name")) {
      let name = target.getAttribute("name");
      if (
        name &&
        selectorGenerator.hasOnlyOne(document.getElementsByName(name))
      ) {
        selectorGenerator.generateNameBasedSelector(name);
      }
    }
    if (
      selectorGenerator.hasOnlyOne(
        document.getElementsByTagName(target.tagName)
      )
    ) {
      selectorGenerator.generateTagNameBasedSelector(target.tagName);
    }
    let links = document.getElementsByTagName("a");
    if (target.tagName.toLowerCase() == "a") {
      if (
        selectorGenerator.hasOnlyOneWithText(
          links,
          (target as HTMLAnchorElement).text
        )
      ) {
        selectorGenerator.generateLinkTextBasedSelector(
          (target as HTMLAnchorElement).text
        );
      }
    }
    if (
      selectorGenerator.hasOnlyOneWithText(
        document.getElementsByTagName("*"),
        (target as any).text
      )
    ) {
      selectorGenerator.generateTextBasedSelector((target as any).text);
    }
    let css = selectorGenerator.getCssSelector(target);
    if (css !== null) {
      selectorGenerator.generateCssBasedSelector(css as string);
    }
    let xpath = selectorGenerator.getRelativeXPathSelector(target);
    if (xpath !== null) {
      selectorGenerator.generateXPathBasedSelector(xpath as string);
    }
    selectorGenerator.collectAttributeBasedSelectors(target);
    selectorGenerator.collectUniqueClassSelectors(target);

    console.log(selectorGenerator.getName());
    for (let i = 0; i < selectorGenerator.selectors.length; i++) {
      console.log(selectorGenerator.selectors[i]);
    }
  }
  console.log("---------------------------------------------------------");
};

abstract class SelectorGenerator {
  selectors: string[] = [];

  abstract getName(): string;

  abstract createSelector(selector: string): string;

  storeSelector(selector: string) {
    if (selector == undefined || selector == "undefined") {
      console.log("WARNING!: Invalid selector at: ");
      console.trace();
      return;
    }
    this.selectors.push(selector);
  }

  generateIdBasedSelector(id: string) {
    throw new Error("You have to implement the method!");
  }

  generateNameBasedSelector(name: string) {
    throw new Error("You have to implement the method!");
  }

  generateTagNameBasedSelector(tagName: string) {
    throw new Error("You have to implement the method!");
  }

  generateLinkTextBasedSelector(linkText: string) {
    throw new Error("You have to implement the method!");
  }

  generateTextBasedSelector(text: string) {
    throw new Error("You have to implement the method!");
  }

  generateCssBasedSelector(css: string) {
    this.storeSelector(this.createSelector("'" + css + "'"));
  }

  generateXPathBasedSelector(xPath: string) {
    throw new Error("You have to implement the method!");
  }

  collectAttributeBasedSelectors(element: Element) {
    let attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
      let nodeName = attributes[i].nodeName.toLowerCase();
      if (
        nodeName != "id" &&
        nodeName != "class" &&
        nodeName != "name" &&
        attributes[i].nodeValue != null &&
        attributes[i].nodeValue != undefined
      ) {
        let cssSelector =
          element.tagName.toLowerCase() +
          "[" +
          nodeName +
          " = '" +
          escape(attributes[i].nodeValue as string) +
          "']";
        let allElements = document.querySelectorAll(cssSelector);
        if (this.hasOnlyOne(allElements)) {
          this.generateAttributeBasedSelector(
            element.tagName.toLowerCase(),
            nodeName,
            escape(attributes[i].nodeValue as string)
          );
        }
      }
    }
  }

  generateAttributeBasedSelector(
    tagName: string,
    attributeName: string,
    attributeValue: string
  ) {
    this.generateCssBasedSelector(
      tagName + "[" + attributeName + " = '" + attributeValue + "']"
    );
  }

  collectUniqueClassSelectors(element: Element) {
    let cl = element.getAttribute("class");
    if (cl == null || cl == undefined) {
      return;
    }
    let classes = cl.split(" ");
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] != "") {
        let cssSelector = element.tagName.toLowerCase() + "." + classes[i];
        if (this.hasOnlyOne(document.querySelectorAll(cssSelector))) {
          this.generateClassBasedSelector(
            element.tagName.toLowerCase(),
            classes[i]
          );
        }
      }
    }
  }

  generateClassBasedSelector(tagName: string, className: string) {
    this.generateCssBasedSelector(tagName + "." + className);
  }

  hasOnlyOne(elementList: any) {
    return elementList.length == 1;
  }

  hasOnlyOneWithText(elementList: HTMLCollectionOf<any>, text: string) {
    let foundCount = 0;
    for (let i = 0; i < elementList.length; i++) {
      if (
        elementList[i].text != undefined &&
        elementList[i].text.localeCompare(text) == 0
      ) {
        foundCount++;
        if (foundCount > 1) {
          return false;
        }
      }
    }
    return foundCount == 1;
  }

  // Source: https://stackoverflow.com/questions/3620116/get-css-path-from-dom-element
  getCssSelector(element: Element) {
    if (!(element instanceof Element)) {
      console.log("Element is not an Element: " + element);
      return;
    }
    let path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += "#" + element.id;
        path.unshift(selector);
        break;
      } else {
        let previousSibling: Element | null = element,
          nth = 1;
        while ((previousSibling = previousSibling.previousElementSibling)) {
          if (previousSibling.nodeName.toLowerCase() == selector) nth++;
        }
        if (nth != 1) selector += ":nth-of-type(" + nth + ")";
      }
      path.unshift(selector);
      element = element.parentNode as Element;
      if (element === null) {
        console.log(
          "ERROR: Cannot determine CSS selector. Please report the error by providing the URL and the element at https://github.com/mszeles/selenideium-element-inspector/issues"
        );
        return null;
      }
    }
    return path.join(" > ");
  }

  getRelativeXPathSelector(element: Element) {
    if (!(element instanceof Element)) {
      console.log("Element is not an Element: " + element);
      return;
    }
    let path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += '[@id="' + element.id + '"]';
        path.unshift(selector);
        break;
      } else {
        let previousSibling: Element | null = element,
          nth = 0;
        while ((previousSibling = previousSibling.previousElementSibling)) {
          if (previousSibling.nodeName.toLowerCase() == selector) nth++;
        }
        if (nth != 0) {
          selector += "[" + nth + "]";
        }
      }
      path.unshift(selector);
      if (element.parentNode === null) {
        console.log(
          "ERROR: Cannot determine XPath selector. Please report the error by providing the URL and the element at https://github.com/mszeles/selenideium-element-inspector/issues"
        );
        return null;
      }
      element = element.parentNode as Element;
    }
    return "//" + path.join("/");
  }
}

class SelenideSelectorGenerator extends SelectorGenerator {
  getName() {
    return "Selenide";
  }

  createSelector(selector: string) {
    return "$(" + selector + ");";
  }

  createXPathSelector(selector: string) {
    return "$x(" + selector + ");";
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("By.id('" + id + "')"));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector(this.createSelector("By.name('" + name + "')"));
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector(this.createSelector("By.tagName('" + tagName + "')"));
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector(this.createSelector("By.linkText('" + linkText + "')"));
  }

  generateTextBasedSelector(text: string) {
    this.storeSelector(this.createSelector("withText('" + text + "')"));
  }

  generateXPathBasedSelector(xPath: string) {
    this.storeSelector(this.createXPathSelector("'" + xPath + "'"));
  }
}

class SeleniumJavaSelectorGenerator extends SelectorGenerator {
  getName() {
    return "Selenium Java";
  }

  createSelector(selector: string) {
    return "driver.findElement(" + selector + ");";
  }

  createXPathSelector(selector: string) {
    return "driver.findElement(By.xpath(" + selector + "));";
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("By.id('" + id + "')"));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector(this.createSelector("By.name('" + name + "')"));
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector(this.createSelector("By.tagName('" + tagName + "')"));
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector(this.createSelector("By.linkText('" + linkText + "')"));
  }

  generateTextBasedSelector(text: string) {}

  generateXPathBasedSelector(xPath: string) {
    this.storeSelector(this.createXPathSelector("'" + xPath + "'"));
  }
}

class SeleniumPythonSelectorGenerator extends SelectorGenerator {
  getName() {
    return "Selenium Python";
  }

  createSelector(selector: string) {
    return "driver." + selector;
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("find_element_by_id('" + id + "')"));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector(
      this.createSelector("find_element_by_name('" + name + "')")
    );
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector(
      this.createSelector("find_element_by_tag_name('" + tagName + "')")
    );
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector(
      this.createSelector("find_element_by_link_text('" + linkText + "')")
    );
  }

  generateTextBasedSelector(text: string) {}

  generateCssBasedSelector(css: string) {
    this.storeSelector(
      this.createSelector("find_element_by_css_selector('" + css + "')")
    );
  }

  generateXPathBasedSelector(xPath: string) {
    this.storeSelector(
      this.createSelector("find_element_by_xpath('" + xPath + "')")
    );
  }
}

class SeleniumCSharpSelectorGenerator extends SelectorGenerator {
  getName() {
    return "Selenium C#";
  }

  createSelector(selector: string) {
    return "driver.FindElement(" + selector + ");";
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("By.Id('" + id + "')"));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector(this.createSelector("By.Name('" + name + "')"));
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector(this.createSelector("By.TagName('" + tagName + "')"));
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector(this.createSelector("By.LinkText('" + linkText + "')"));
  }

  generateTextBasedSelector(text: string) {}

  generateCssBasedSelector(css: string) {
    this.storeSelector(this.createSelector("By.CssSelector('" + css + "')"));
  }

  generateXPathBasedSelector(xPath: string) {
    this.storeSelector(this.createSelector("By.XPath('" + xPath + "')"));
  }
}

class SeleniumJavaScriptSelectorGenerator extends SelectorGenerator {
  getName() {
    return "Selenium JavaScript";
  }

  createSelector(selector: string) {
    return "driver.findElement(" + selector + ");";
  }

  createXPathSelector(selector: string) {
    return "driver.findElement(By.xpath(" + selector + "));";
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("By.id('" + id + "')"));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector(this.createSelector("By.name('" + name + "')"));
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector(this.createSelector("By.tagName('" + tagName + "')"));
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector(this.createSelector("By.linkText('" + linkText + "')"));
  }

  generateTextBasedSelector(text: string) {}

  generateCssBasedSelector(css: string) {
    this.storeSelector(this.createSelector("By.css('" + css + "')"));
  }

  generateXPathBasedSelector(xPath: string) {
    this.storeSelector(this.createSelector("By.xpath('" + xPath + "')"));
  }
}

class CypressSelectorGenerator extends SelectorGenerator {
  getName() {
    return "Cypress";
  }

  createSelector(selector: string) {
    return "cy.get('" + selector + "')";
  }

  createXPathSelector(selector: string) {
    return "cy.xpath('" + selector + "')";
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("#" + id));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector(this.createSelector('*[name="' + name + '"]'));
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector(this.createSelector(tagName));
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector(this.createSelector('a:contains("' + linkText + '")'));
  }

  generateTextBasedSelector(text: string) {}

  generateCssBasedSelector(css: string) {
    this.storeSelector(this.createSelector(css));
  }

  generateXPathBasedSelector(xPath: string) {
    this.storeSelector(this.createXPathSelector(xPath));
  }
}

class TestCafeSelectorGenerator extends SelectorGenerator {
  getName() {
    return "TestCafe";
  }

  createSelector(selector: string) {
    return "Selector('" + selector + "')";
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("#" + id));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector("Selector('*[name=" + name + "'])");
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector("Selector('" + tagName + "')");
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector("Selector('a').withText('" + linkText + "')");
  }

  generateTextBasedSelector(text: string) {
    this.storeSelector("Selector('*').withText('" + text + "')");
  }

  generateCssBasedSelector(css: string) {
    this.storeSelector(this.createSelector(css));
  }

  generateXPathBasedSelector(xPath: string) {}
}

class PlaywrightSelectorGenerator extends SelectorGenerator {
  getName() {
    return "Playwright";
  }

  createSelector(selector: string) {
    return "await page.locator('" + selector + "')";
  }

  createXPathSelector(selector: string) {
    return "element." + selector;
  }

  generateAttributeBasedSelector(
    tagName: string,
    attributeName: string,
    attributeValue: string
  ) {
    return this.generateCssBasedSelector(
      tagName + "[" + attributeName + ' = "' + attributeValue + '"]'
    );
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("id=" + id));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector(this.createSelector('name="' + name + '"'));
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector(this.createSelector(tagName));
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector(this.createSelector('a[text="' + linkText + '"]'));
  }

  generateTextBasedSelector(text: string) {
    this.storeSelector(this.createSelector('text="' + text + '"'));
  }

  generateCssBasedSelector(css: string) {
    this.storeSelector(this.createSelector(css));
  }

  generateXPathBasedSelector(xPath: string) {
    this.storeSelector(this.createSelector("xpath=" + xPath));
  }
}

class SquishSelectorGenerator extends SelectorGenerator {
  getName() {
    return "Squish";
  }

  generateAttributeBasedSelector(
    tagName: string,
    attributeName: string,
    attributeValue: string
  ) {
    return this.storeSelector(
      this.createSelector(
        "{tagName='" +
          tagName +
          "', " +
          attributeName +
          "='" +
          attributeValue +
          "'}"
      )
    );
  }

  createSelector(selector: string) {
    if (selector == undefined || selector == "undefined") {
      console.log("WARNING!: Invalid selector at:");
      console.trace();
    }
    return 'findObject("' + selector + '")';
  }

  createXPathSelector(selector: string) {
    return "self.container." + selector;
  }

  generateIdBasedSelector(id: string) {
    this.storeSelector(this.createSelector("{id='" + id + "'}"));
  }

  generateNameBasedSelector(name: string) {
    this.storeSelector(this.createSelector("{name='" + name + "'}"));
  }

  generateTagNameBasedSelector(tagName: string) {
    this.storeSelector(this.createSelector("{tagName='" + tagName + "'}"));
  }

  generateLinkTextBasedSelector(linkText: string) {
    this.storeSelector(
      this.createSelector("{tagName='a', innerText='" + linkText + "'}")
    );
  }

  generateTextBasedSelector(text: string) {
    this.storeSelector(this.createSelector("{innerText='" + text + "'}"));
  }

  generateCssBasedSelector(css: string) {}

  generateXPathBasedSelector(xPath: string) {
    this.storeSelector(
      this.createXPathSelector("evaluateXPath('" + xPath + "')")
    );
  }
}
