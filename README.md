# Firefox Extension Base Template

This is a reusable Firefox extension template using Manifest V3.

## Features

- Dark mode support
- Context menu integration
- Click counter with persistent storage
- Popup with settings link
- Options page with i18n
- Keyboard shortcuts (Ctrl+Shift+U to open, Ctrl+Shift+R to reset counter)

## Installation

1. Clone the repo
2. Load the `src` folder as an "Unpacked Extension" in `about:debugging`

## Chrome

The property `background.service_worker` has been included in `manifest.json` to support Chrome. This causes a warning in Firefox. On Feb 1st 2025 this warning could be safely ignored.

```
Reading manifest: Warning processing background.service_worker: An unexpected property was found in the WebExtension manifest.
```
