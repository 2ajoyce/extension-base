// Hide the document until dark mode is applied
document.documentElement.style.visibility = "hidden";

// Check dark mode setting before the page fully loads
chrome.storage.sync.get("darkModeEnabled", (data) => {
  const isDark = data.darkModeEnabled || false;
  if (isDark) {
    document.documentElement.classList.add("dark-mode");
  }
  document.documentElement.style.visibility = "visible"; // Reveal the page after setting is applied
});
