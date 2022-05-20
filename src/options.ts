import getObjectFromLocalStorage from "./utils/get-object-from-local-storage";

let settings = [
  "selenide",
  "selenium-java",
  "selenium-javascript",
  "selenium-python",
  "selenium-csharp",
  "playwright",
  "cypress",
  "test-cafe",
  "squish",
];

const saveObjectInLocalStorage = async function <T>(obj: T) {
  return new Promise<void>((resolve, reject) => {
    try {
      console.log("Saving: " + JSON.stringify(obj));
      chrome.storage.local.set(obj, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

async function storeSettings(id: string) {
  console.log("Storing setting for: #" + id);
  const { checked } = document.getElementById(id) as HTMLInputElement;
  await saveObjectInLocalStorage({ [id]: checked });
}

document.addEventListener("DOMContentLoaded", async function () {
  for (let i = 0; i < settings.length; i++) {
    let id = settings[i];
    let savedOption = (await getObjectFromLocalStorage(id)) as boolean;
    console.log("Saved option: " + savedOption);
    if (savedOption == null) {
      console.log("Setting checked for " + id + " to true");
      toggle(id, true);
    } else {
      console.log("Setting checked for " + id + " to " + savedOption);
      toggle(id, savedOption);
    }
  }
});

function toggle(id: string, checked: boolean) {
  const checkbox = document.getElementById(id) as HTMLInputElement;
  if (checked !== checkbox.checked) {
    checkbox.click();
  }
}

document.getElementById("save")?.addEventListener("click", async function () {
  for (let i = 0; i < settings.length; i++) {
    await storeSettings(settings[i]);
  }
});
