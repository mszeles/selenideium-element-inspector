# Selenideium Element Inspector - A handy tool to log attributes and Selenide, Selenium locators of any web element

You can save dozens of minutes daily while automating tests using Selenide, Selenium, Cypress, Playwright, TestCafe and Squish. You can automagically generate complete line of copy-pastable selector code by simply clicking on an element.

**Usage**

1. Install the plugin
2. Open a page
3. Open DevTools
4. Open console
5. Enable permanent log in the console's settings to prevent clearing the console on page change
6. Click on an element
7. Select the most nice-looking selector
8. Copy-paste it into your favourite IDE
9. Go to step 6.

You can download it from the Chrome Web Store: [Selenideium Element Inspector](https://chrome.google.com/webstore/detail/selenideium-element-inspe/mgfhljklijclnfeglclagdeoiknnmnda)


Any feedback and feature request is much appreciated.

Please [leave a review](https://chrome.google.com/webstore/detail/selenideium-element-inspe/mgfhljklijclnfeglclagdeoiknnmnda) in case you find the plugin useful!

[**Buy me a coffee in case you save time by using Selenideium Element Inspector!**](https://buymeacoffee.com/mikiszeles) 😊


📚**Join the Selenide community** on [LinkedIn](https://www.linkedin.com/groups/9154550/)! ✌

## Running locally

1. `npm i` - installs dependencies
2. `npm run watch` - runs in development mode, watches for file changes
3. Open chrome://extensions
4. Check the Developer mode checkbox
5. Click on the Load unpacked extension button
6. Select the folder called `build`

## Release notes

### V2.0
* Added support for:
    * Selenium JavaScript
    * Selenium Python 
    * Selenium C#
    * Cypress
    * TestCafe
    * Playwright
    * Squish

* Provide an option to select the testing frameworks for which selectors will be generated

### V1.2
* Printing relative XPath selector for both Selenide and Selenium
* Printing CSS selectors based on any unique attribute for both Selenide and Selenium
* Printing CSS selectors based on any unique class for both Selenide and Selenium
* Automatically adding ";" to the end of the selector, so you really only have to copy-paste the code.
* Marking the start and end of the logs belonging to Selenideium Element Inspector

### V1.1
* Updated extension description

### V1.0
* Printing the clicked element to the console for both Selenide and Selenium
* Printing id based selector for both Selenide and Selenium
* Printing name based selector for both Selenide and Selenium
* Printing tagName based selector for both Selenide and Selenium
* Printing linkText based selector for both Selenide and Selenium
* Printing withText based selector for Selenide
* Printing CSS based selector for both Selenide and Selenium



