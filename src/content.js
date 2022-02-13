document.onclick = function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    console.log(target)
    console.log("Selenide")
    if (target.hasAttribute("id")) {
        console.log("$(By.id('" + target.getAttribute("id") + "'))")
    }
    console.log("Selenium")
    if (target.hasAttribute("id")) {
        console.log("driver.findElement(By.id('" + target.getAttribute("id") + "'))")
    }
}