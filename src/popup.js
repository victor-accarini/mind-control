// Cross-browser storage abstraction
// Firefox supports browser.storage.sync, Safari only supports browser.storage.local
const storageAPI = browser.storage.sync || browser.storage.local;

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  const switches = document.querySelectorAll('input[type="checkbox"]');
  switches.forEach((switchElement) => {
    switchElement.addEventListener("change", saveSettings);
  });
});

const defaultSettings = {
  debug: false,
};

function loadSettings() {
  storageAPI.get(["youtubeFilterSettings"], (result) => {
    const settings = result.youtubeFilterSettings || { ...defaultSettings };

    for (let key in defaultSettings) {
      let elem = document.getElementById(key);
      if (elem.checked !== settings[key]) {
        elem.checked = settings[key];
      }
    }
  });
}

function saveSettings() {
  settings = {};
  for (let key in defaultSettings) {
    settings[key] = document.getElementById(key).checked;
  }

  storageAPI.set({ youtubeFilterSettings: settings }, () => {
    console.log("Settings saved");
  });
}
