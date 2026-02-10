// background.js - Service worker for handling downloads

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download') {
    downloadFile(request.url, request.filename)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Download error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

// Function to download a file
async function downloadFile(url, filename) {
  try {
    // Use Chrome's download API
    const downloadId = await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: false  // Set to true if you want the save dialog to appear
    });
    
    console.log('Download started with ID:', downloadId);
    return downloadId;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

// Optional: Listen for download completion
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    console.log('Download completed:', delta.id);
  }
  if (delta.state && delta.state.current === 'interrupted') {
    console.log('Download interrupted:', delta.id);
  }
});

// Log when the service worker starts
console.log('PDF Downloader extension service worker started');
