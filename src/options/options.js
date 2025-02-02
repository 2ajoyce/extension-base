// Apply i18n translations
document.querySelectorAll("[data-i18n]").forEach((el) => {
  el.textContent = chrome.i18n.getMessage(el.dataset.i18n);
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("version").textContent =
    chrome.runtime.getManifest().version;
});

document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkMode");

  // Load stored setting and update UI
  chrome.storage.sync.get("darkModeEnabled", (data) => {
    darkModeToggle.checked = data.darkModeEnabled || false;
  });

  // Toggle dark mode
  darkModeToggle.addEventListener("change", () => {
    const isDarkMode = darkModeToggle.checked;
    console.log("Dark mode toggled!", isDarkMode);
    chrome.storage.sync.set({ darkModeEnabled: isDarkMode }, () => {
      document.documentElement.classList.toggle("dark-mode", isDarkMode);
    });
  });

  // Listen for storage changes and update UI dynamically
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.darkModeEnabled) {
      darkModeToggle.checked = changes.darkModeEnabled.newValue;
      document.documentElement.classList.toggle(
        "dark-mode",
        changes.darkModeEnabled.newValue
      );
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Confirm before resetting settings
  document.getElementById("resetSettings").addEventListener("click", () => {
    if (confirm(chrome.i18n.getMessage("confirm_reset"))) {
      chrome.storage.sync.clear(() => {
        console.log("Settings reset to default.");
        // Update Dark Mode
        document.getElementById("darkMode").checked = false;
        document.documentElement.classList.remove("dark-mode");

        // Update Context Menu
        document.getElementById("contextMenuToggle").checked = true;
        chrome.storage.sync.set({ contextMenuEnabled: true }, () => {
          chrome.runtime.sendMessage({
            updateContextMenu: true,
            enabled: true,
          });
        });
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const contextMenuToggle = document.getElementById("contextMenuToggle");

  // Load stored setting and update UI
  chrome.storage.sync.get("contextMenuEnabled", (data) => {
    contextMenuToggle.checked = data.contextMenuEnabled ?? true; // Default to enabled
  });

  // Toggle context menu setting
  contextMenuToggle.addEventListener("change", () => {
    const isEnabled = contextMenuToggle.checked;
    console.log("Context menu toggled!", isEnabled);
    chrome.storage.sync.set({ contextMenuEnabled: isEnabled }, () => {
      chrome.runtime.sendMessage({
        updateContextMenu: true,
        enabled: isEnabled,
      });
    });
  });
});
