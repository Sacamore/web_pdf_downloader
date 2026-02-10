# Installation Guide - Web PDF Downloader Extension

This guide provides step-by-step instructions for installing the Web PDF Downloader extension in Microsoft Edge.

## Prerequisites

- Microsoft Edge browser (version 88 or later)
- The extension files (all files in this repository)

## Installation Steps

### 1. Prepare the Extension Files

First, ensure you have all the extension files in a single folder:

```
web_pdf_downloader/
├── manifest.json
├── popup.html
├── popup.js
├── background.js
├── content.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
```

You can either:
- Clone the repository: `git clone https://github.com/Sacamore/web_pdf_downloader.git`
- Download as ZIP and extract

### 2. Open Edge Extensions Page

There are several ways to access the Extensions page in Microsoft Edge:

**Method 1: Via URL**
- Type `edge://extensions/` in the address bar and press Enter

**Method 2: Via Menu**
- Click the three dots menu (⋯) in the top-right corner
- Select "Extensions"
- Click "Manage extensions"

### 3. Enable Developer Mode

- Look for the "Developer mode" toggle in the bottom-left corner of the Extensions page
- Click to enable it
- The page will refresh and show additional options

### 4. Load the Extension

- Click the "Load unpacked" button (it appears after enabling Developer mode)
- In the file browser, navigate to the `web_pdf_downloader` folder
- Select the folder (the one containing `manifest.json`) and click "Select Folder"

### 5. Verify Installation

After loading, you should see:
- The extension appears in your extensions list
- The extension name: "Web PDF Downloader"
- The version: "1.0.0"
- A description: "An extension to find and download PDF files from web pages"
- The extension icons

### 6. Pin the Extension (Recommended)

To easily access the extension:
- Click the puzzle piece icon (🧩) in the Edge toolbar
- Find "Web PDF Downloader" in the list
- Click the pin icon (📌) next to it
- The extension icon will now appear in your toolbar

## Troubleshooting

### Extension Not Loading

**Error: "Manifest file is missing or unreadable"**
- Solution: Ensure you selected the correct folder containing `manifest.json`

**Error: "Manifest version 3 is required"**
- Solution: Update Microsoft Edge to version 88 or later

**Error: "Could not load icon"**
- Solution: Verify that the `icons` folder exists with all three icon files

### Extension Icon Not Showing

- Refresh the extensions page (`edge://extensions/`)
- Click the "Reload" button under the extension
- Restart Microsoft Edge

### Permission Errors

If you see permission-related errors:
- Check that all required files have read permissions
- Ensure the extension folder is not in a restricted location (like Program Files)

## Testing the Extension

1. **Open a test page** with PDF links (use the included `test-page.html`)
2. **Click the extension icon** in your toolbar
3. **Verify it detects PDFs** - You should see a list of PDFs found on the page
4. **Test downloading** - Click a "Download" button to verify it works

## Updating the Extension

If you make changes to the extension files:

1. Go to `edge://extensions/`
2. Find "Web PDF Downloader"
3. Click the "Reload" button (circular arrow icon)
4. Test your changes

## Uninstalling

To remove the extension:

1. Go to `edge://extensions/`
2. Find "Web PDF Downloader"
3. Click "Remove"
4. Confirm the removal

## Using in Google Chrome

This extension is also compatible with Google Chrome:

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension folder

The same steps apply to other Chromium-based browsers.

## Next Steps

- Read the [README.md](README.md) for usage instructions
- Open `test-page.html` to test the extension
- Review the source code to understand how it works
- Customize the extension for your needs

## Support

If you encounter issues:
- Check the browser console for errors
- Inspect the extension popup (right-click the icon → "Inspect popup")
- Check the service worker logs at `edge://extensions/`
- Report issues on the GitHub repository
