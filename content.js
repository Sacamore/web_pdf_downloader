// content.js - Content script that runs on web pages

// This script is injected into web pages and can be used to 
// automatically detect and highlight PDF links or perform other operations

// Function to highlight PDF links on the page
function highlightPDFLinks() {
  const links = document.querySelectorAll('a[href]');
  let pdfCount = 0;
  
  links.forEach(link => {
    const href = link.href;
    if (href && (href.toLowerCase().endsWith('.pdf') || href.toLowerCase().includes('.pdf?'))) {
      // Add a visual indicator for PDF links
      if (!link.querySelector('.pdf-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'pdf-indicator';
        indicator.textContent = ' 📄';
        indicator.style.cssText = 'color: red; font-size: 0.8em; margin-left: 2px;';
        indicator.title = 'PDF Link';
        link.appendChild(indicator);
        pdfCount++;
      }
    }
  });
  
  return pdfCount;
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlightPDFs') {
    const count = highlightPDFLinks();
    sendResponse({ success: true, count: count });
  }
  return true;
});

// Optional: Auto-highlight PDFs when the page loads
// Uncomment the following lines to enable auto-highlighting
// window.addEventListener('load', () => {
//   setTimeout(highlightPDFLinks, 1000);
// });

console.log('Web PDF Downloader content script loaded');
