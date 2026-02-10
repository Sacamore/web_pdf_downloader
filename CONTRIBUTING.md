# Contributing to Web PDF Downloader

Thank you for your interest in contributing to the Web PDF Downloader extension! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Microsoft Edge or Google Chrome (version 88+)
- Git
- Text editor or IDE (VS Code recommended)
- Basic knowledge of JavaScript, HTML, and CSS

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/web_pdf_downloader.git
   cd web_pdf_downloader
   ```

2. **Load the Extension**
   - Follow the instructions in [INSTALL.md](INSTALL.md)
   - Load the extension in developer mode

3. **Make Changes**
   - Edit the relevant files
   - Test your changes

4. **Reload the Extension**
   - Go to `edge://extensions/`
   - Click "Reload" under the extension

## Project Structure

```
web_pdf_downloader/
├── manifest.json       # Extension configuration (Manifest V3)
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic and PDF scanning
├── background.js      # Service worker for downloads
├── content.js         # Content script for page interaction
├── icons/             # Extension icons (16, 48, 128 px)
├── README.md          # Main documentation
├── INSTALL.md         # Installation instructions
└── test-page.html     # Test page with sample PDFs
```

## Key Components

### 1. manifest.json
- Extension metadata and configuration
- Permissions and capabilities
- Must follow Manifest V3 specification

### 2. popup.html & popup.js
- User interface for the extension
- PDF scanning and display logic
- Communicates with background script

### 3. background.js
- Service worker (no persistent background page)
- Handles download requests
- Listens for messages from popup

### 4. content.js
- Runs in the context of web pages
- Can manipulate page content
- Optional highlighting of PDF links

## Coding Guidelines

### JavaScript

- Use modern ES6+ syntax
- Use `async/await` for asynchronous operations
- Include error handling (`try/catch`)
- Add comments for complex logic
- Use meaningful variable names

**Example:**
```javascript
async function scanForPDFs() {
  try {
    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    // ... rest of the code
  } catch (error) {
    console.error('Error scanning:', error);
  }
}
```

### HTML & CSS

- Use semantic HTML5 elements
- Keep styles modular and maintainable
- Ensure responsive design
- Test in different viewport sizes

### Manifest V3 Compliance

- Use `service_worker` instead of background scripts
- Use `chrome.action` instead of `chrome.browserAction`
- Follow asynchronous messaging patterns
- No inline scripts in HTML (use external JS files)

## Testing

### Manual Testing

1. **Load the extension** in developer mode
2. **Test different scenarios:**
   - Pages with PDF links
   - Pages without PDFs
   - Pages with embedded PDFs
   - Dynamic content with PDFs
3. **Verify downloads** work correctly
4. **Check error handling** with invalid URLs

### Test Page

Use the included `test-page.html` for basic testing:
```bash
# Open in your browser
open test-page.html  # macOS
start test-page.html # Windows
xdg-open test-page.html # Linux
```

### Debugging

**Popup Debug:**
- Right-click extension icon → "Inspect popup"
- Check console for errors

**Background Script Debug:**
- Go to `edge://extensions/`
- Click "Service worker" under the extension
- View console logs

**Content Script Debug:**
- Open DevTools on any webpage (F12)
- Check console for content script logs

## Making Changes

### Adding Features

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Update relevant files
   - Add comments
   - Test thoroughly

3. **Update documentation**
   - Update README.md if needed
   - Add comments to code

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of your feature"
   ```

### Fixing Bugs

1. **Create a bug fix branch**
   ```bash
   git checkout -b fix/bug-description
   ```

2. **Fix the bug**
   - Identify the root cause
   - Implement the fix
   - Test to ensure it's resolved

3. **Commit the fix**
   ```bash
   git commit -m "Fix: description of the bug fix"
   ```

### Commit Message Format

Use clear, descriptive commit messages:

- `Add: [description]` - New features
- `Fix: [description]` - Bug fixes
- `Update: [description]` - Updates to existing features
- `Docs: [description]` - Documentation changes
- `Style: [description]` - Code style changes
- `Refactor: [description]` - Code refactoring

**Examples:**
```
Add: support for detecting PDFs in shadow DOM
Fix: extension icon not showing in toolbar
Update: improve PDF detection algorithm
Docs: add troubleshooting section to README
```

## Submitting Changes

1. **Push to your fork**
   ```bash
   git push origin your-branch-name
   ```

2. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

3. **PR Description Should Include:**
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (if UI changes)

## Enhancement Ideas

Here are some ideas for contributions:

### Features
- Add filter options (by domain, file size, etc.)
- Batch download multiple PDFs
- Save download history
- Custom download folder selection
- PDF preview before download
- Right-click context menu for PDFs

### Improvements
- Better error messages
- Loading indicators
- Download progress tracking
- Keyboard shortcuts
- Dark mode for popup
- Internationalization (i18n)

### Performance
- Optimize PDF detection algorithm
- Reduce memory usage
- Faster scanning on large pages

## Code Review Process

1. **Automated Checks** (if set up)
   - Linting
   - Format checking

2. **Manual Review**
   - Code quality
   - Functionality
   - Documentation

3. **Testing**
   - Feature works as expected
   - No breaking changes
   - Edge cases handled

## Questions?

If you have questions:
- Open an issue on GitHub
- Check existing issues and PRs
- Review the documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!
