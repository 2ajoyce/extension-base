console.log("Background script loaded.");

// Function to create or remove context menu
function updateContextMenu(enabled) {
  chrome.contextMenus.removeAll(() => {
    if (enabled) {
      chrome.contextMenus.create({
        id: "resetCounter",
        title: "Reset Click Counter",
        contexts: ["all"],
      });
      console.log("Context menu created.");
    } else {
      console.log("Context menu disabled.");
    }
  });
}

// Load setting on startup and set context menu accordingly
chrome.storage.sync.get("contextMenuEnabled", (data) => {
  updateContextMenu(data.contextMenuEnabled ?? true); // Default to enabled
});

// Listen for the extension installation event:
chrome.runtime.onInstalled.addListener(() => {
  console.log("Hello World: Extension installed!");

  // Set initial badge value
  chrome.storage.local.get("clickCounter", (data) => {
    updateBadge(data.clickCounter || 0);
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("clickCounter", (data) => {
    updateBadge(data.clickCounter || 0);
  });
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);

  if (message.greeting === "Hello from popup!") {
    console.log(`Button clicked ${message.count} times`);
    updateBadge(message.count);
    sendResponse({ reply: `Counter updated: ${message.count}` });
  }

  if (message.updateContextMenu !== undefined) {
    updateContextMenu(message.enabled);
  }
});

// Handle context menu clicks (Reset Counter)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "resetCounter") {
    console.log("Resetting click counter...");

    // Reset counter in storage
    chrome.storage.local.set({ clickCounter: 0 }, () => {
      console.log("Click counter reset.");

      // Update badge
      updateBadge(0);

      // Notify all pages that use the counter
      chrome.runtime.sendMessage({ counterReset: true });
    });
  }
});

// Function to update badge
function updateBadge(count) {
  chrome.action.setBadgeText({ text: count > 0 ? count.toString() : "" });
  chrome.action.setBadgeBackgroundColor({ color: "#FF5733" }); // Red background
}
