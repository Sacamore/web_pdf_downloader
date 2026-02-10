// popup.js - Handles the popup UI and PDF scanning

document.addEventListener('DOMContentLoaded', function() {
  const scanBtn = document.getElementById('scanBtn');
  const statusDiv = document.getElementById('status');
  const pdfListDiv = document.getElementById('pdfList');
  
  // Scan button click handler
  scanBtn.addEventListener('click', scanForPDFs);
  
  // Auto-scan on popup open
  scanForPDFs();
});

async function scanForPDFs() {
  const statusDiv = document.getElementById('status');
  const pdfListDiv = document.getElementById('pdfList');
  const scanBtn = document.getElementById('scanBtn');
  
  // Show loading state
  statusDiv.style.display = 'block';
  statusDiv.textContent = 'Scanning current page...';
  pdfListDiv.innerHTML = '';
  scanBtn.disabled = true;
  
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('No active tab found');
    }
    
    // Inject content script to find PDFs
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: findPDFsOnPage
    });
    
    const pdfs = results[0].result;
    
    // Hide status
    statusDiv.style.display = 'none';
    scanBtn.disabled = false;
    
    // Display results
    if (pdfs && pdfs.length > 0) {
      displayPDFs(pdfs);
    } else {
      pdfListDiv.innerHTML = '<div class="no-pdfs">No PDF links found on this page.</div>';
    }
  } catch (error) {
    console.error('Error scanning for PDFs:', error);
    statusDiv.textContent = 'Error: ' + error.message;
    statusDiv.style.backgroundColor = '#ffebee';
    statusDiv.style.color = '#c62828';
    scanBtn.disabled = false;
  }
}

// Function that runs in the page context to find PDFs
function findPDFsOnPage() {
  const pdfs = new Set();
  
  // Find all links that point to PDF files
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.href;
    if (href && (href.toLowerCase().endsWith('.pdf') || href.toLowerCase().includes('.pdf?'))) {
      pdfs.add({
        url: href,
        text: link.textContent.trim() || 'Untitled PDF'
      });
    }
  });
  
  // Find all embed and object tags with PDF sources
  const embeds = document.querySelectorAll('embed[src], object[data]');
  embeds.forEach(embed => {
    const src = embed.getAttribute('src') || embed.getAttribute('data');
    if (src && (src.toLowerCase().endsWith('.pdf') || src.toLowerCase().includes('.pdf?'))) {
      const fullUrl = new URL(src, window.location.href).href;
      pdfs.add({
        url: fullUrl,
        text: 'Embedded PDF'
      });
    }
  });
  
  // Find iframes with PDF sources
  const iframes = document.querySelectorAll('iframe[src]');
  iframes.forEach(iframe => {
    const src = iframe.getAttribute('src');
    if (src && (src.toLowerCase().endsWith('.pdf') || src.toLowerCase().includes('.pdf?'))) {
      const fullUrl = new URL(src, window.location.href).href;
      pdfs.add({
        url: fullUrl,
        text: 'PDF in iframe'
      });
    }
  });
  
  return Array.from(pdfs);
}

function displayPDFs(pdfs) {
  const pdfListDiv = document.getElementById('pdfList');
  pdfListDiv.innerHTML = '';
  
  pdfs.forEach((pdf, index) => {
    const pdfItem = document.createElement('div');
    pdfItem.className = 'pdf-item';
    
    const pdfText = document.createElement('div');
    pdfText.style.fontWeight = 'bold';
    pdfText.style.marginBottom = '5px';
    pdfText.textContent = pdf.text.substring(0, 50) + (pdf.text.length > 50 ? '...' : '');
    
    const pdfUrl = document.createElement('div');
    pdfUrl.className = 'pdf-url';
    pdfUrl.textContent = pdf.url;
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = 'Download';
    downloadBtn.addEventListener('click', () => downloadPDF(pdf.url, pdf.text));
    
    pdfItem.appendChild(pdfText);
    pdfItem.appendChild(pdfUrl);
    pdfItem.appendChild(downloadBtn);
    
    pdfListDiv.appendChild(pdfItem);
  });
}

function downloadPDF(url, filename) {
  // Request download through the background script
  chrome.runtime.sendMessage({
    action: 'download',
    url: url,
    filename: sanitizeFilename(filename) + '.pdf'
  }, response => {
    if (response && response.success) {
      console.log('Download started:', url);
    } else {
      console.error('Download failed:', response ? response.error : 'Unknown error');
      alert('Failed to download PDF. Please try again.');
    }
  });
}

function sanitizeFilename(filename) {
  // Remove invalid characters from filename
  return filename.replace(/[^a-z0-9_\-]/gi, '_').substring(0, 50);
}
