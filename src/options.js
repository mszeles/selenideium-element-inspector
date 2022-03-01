let settings = [
    "selenide", "selenium-java", "selenium-javascript", "selenium-python",
    "selenium-csharp", "playwright", "cypress", "test-cafe", "squish"
]
const saveObjectInLocalStorage = async function(obj) {
    return new Promise((resolve, reject) => {
        try {
            console.log("Saving: " + JSON.stringify(obj))
            chrome.storage.local.set(obj, function() {
                resolve()
            })
        } catch (ex) {
            reject(ex)
        }
    });
};

const getObjectFromLocalStorage = async function(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function(value) {
                resolve(value[key])
            })
        } catch (ex) {
            reject(ex)
        }
    })
}

async function storeSettings(id) {
    console.log("Storing setting for: #" + id)
    if (document.getElementById(id).checked) {
        await saveObjectInLocalStorage({[id]: true})
    } else {
        await saveObjectInLocalStorage({[id]: false})
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    for (let i = 0; i < settings.length; i++ ) {
        let id = settings[i]
        let savedOption = await getObjectFromLocalStorage(id)
        console.log("Saved option: " + savedOption)
         if (savedOption == null) {
            console.log("Setting checked for " + id + " to true")
            toggle(id, true)
        } else {
            console.log("Setting checked for " + id + " to " + savedOption)
            toggle(id, savedOption)
        }
    }
});

function toggle(id, checked) {
    var checkbox = document.getElementById(id);
    if (checked != checkbox.checked) {
        checkbox.click()
    }
}

document.getElementById('save').addEventListener('click', async function() {
    for (let i = 0; i < settings.length; i++ ) {
        await storeSettings(settings[i])
    }
});