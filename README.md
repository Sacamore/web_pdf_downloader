# Web PDF Downloader

A Microsoft Edge browser extension to find and download PDF files from web pages.

## Features

- 🔍 **Automatic PDF Detection**: Scans the current page for PDF links
- 📥 **One-Click Downloads**: Download PDFs directly from the extension popup
- 🎯 **Multiple Detection Methods**: Finds PDFs in links, embeds, objects, and iframes
- 🎨 **Clean Interface**: Simple and intuitive popup interface
- 🚀 **Fast & Lightweight**: Minimal performance impact

## Installation

### Installing in Microsoft Edge

1. **Download or Clone the Repository**
   ```bash
   git clone https://github.com/Sacamore/web_pdf_downloader.git
   cd web_pdf_downloader
   ```

2. **Open Edge Extensions Page**
   - Open Microsoft Edge
   - Navigate to `edge://extensions/`
   - Or click the menu (three dots) → Extensions → Manage Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the bottom-left corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `web_pdf_downloader` folder (the one containing `manifest.json`)
   - The extension should now appear in your extensions list

5. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in the toolbar
   - Click the pin icon next to "Web PDF Downloader" to pin it to the toolbar

## Usage

1. **Navigate to a webpage** that contains PDF links
2. **Click the extension icon** in your browser toolbar
3. **Wait for the scan** - The extension will automatically scan the page for PDFs
4. **Click "Download"** on any PDF you want to save
5. **Find your PDF** in your default downloads folder

### Manual Scan

If you want to rescan the page (e.g., after dynamic content loads), click the "Scan for PDFs" button in the popup.

## File Structure

```
web_pdf_downloader/
├── manifest.json        # Extension configuration
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic and PDF detection
├── background.js       # Service worker for handling downloads
├── content.js          # Content script for page interaction
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## How It Works

1. **Content Script**: Injected into web pages to find PDF links
2. **Popup Interface**: Displays found PDFs and provides download buttons
3. **Background Service Worker**: Handles the actual download requests
4. **Chrome Downloads API**: Uses browser's native download manager

## Permissions

The extension requires the following permissions:

- **activeTab**: To access the current tab's content
- **scripting**: To inject scripts that find PDFs
- **downloads**: To download PDF files
- **host_permissions**: To access all URLs for PDF detection

## Development

### Testing

1. Make changes to the source files
2. Go to `edge://extensions/`
3. Click the "Reload" button under the extension
4. Test your changes

### Debugging

- **Popup**: Right-click the extension icon → "Inspect popup"
- **Background Script**: Go to `edge://extensions/` → Click "Service worker"
- **Content Script**: Open DevTools on any webpage

## Compatibility

- **Microsoft Edge**: Version 88+ (Manifest V3 support)
- **Google Chrome**: Version 88+ (Also compatible with Chromium-based browsers)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.
