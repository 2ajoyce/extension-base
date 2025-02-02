document.querySelectorAll("[data-i18n]").forEach((el) => {
  el.textContent = chrome.i18n.getMessage(el.dataset.i18n);
});

document.addEventListener("DOMContentLoaded", () => {
  const logButton = document.getElementById("logButton");
  const openOptions = document.getElementById("openOptions");
  const counterDisplay = document.getElementById("counter");

  // Load stored counter
  chrome.storage.local.get("clickCounter", (data) => {
    counterDisplay.textContent = data.clickCounter || 0;
  });

  logButton.addEventListener("click", () => {
    console.debug("Popup button clicked!");

    chrome.storage.local.get("clickCounter", (data) => {
      let newCount = (data.clickCounter || 0) + 1;
      chrome.storage.local.set({ clickCounter: newCount });

      chrome.runtime.sendMessage({
        greeting: "Hello from popup!",
        count: newCount,
      });
    });
  });

  openOptions.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  // Listen for changes in storage and update UI
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.clickCounter) {
      counterDisplay.textContent = changes.clickCounter.newValue;
    }
  });

  // Listen for reset message from background.js
  chrome.runtime.onMessage.addListener((message) => {
    if (message.counterReset) {
      console.log("Counter reset via context menu.");
      counterDisplay.textContent = "0";
    }
  });

  // Load Dark Mode setting and apply it to the popup
  chrome.storage.sync.get("darkModeEnabled", (data) => {
    const isDark = data.darkModeEnabled || false;
    applyDarkMode(isDark);
  });

  // Listen for changes in dark mode settings and update UI dynamically
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.darkModeEnabled) {
      applyDarkMode(changes.darkModeEnabled.newValue);
    }
  });

  function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
  }
});
