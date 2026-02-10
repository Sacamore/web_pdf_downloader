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
  const pdfsMap = new Map();
  
  // Helper function to check if a URL is a PDF
  function isPDFUrl(urlString) {
    try {
      const url = new URL(urlString);
      const pathname = url.pathname.toLowerCase();
      return pathname.endsWith('.pdf');
    } catch {
      return urlString.toLowerCase().includes('.pdf');
    }
  }
  
  // Helper function to extract PDF URL from an iframe
  function getPDFUrlFromIframe(iframe) {
    const src = iframe.getAttribute("src");
    if (!src) return null;

    try {
      const u = new URL(src, window.location.href);

      // 1) pdf.js viewer 模式：viewer.html?file=<encoded_url>
      // 你的页面就是这种
      const isPdfJsViewer =
        /pdfjs\/web\/viewer\.html$/i.test(u.pathname) || u.href.toLowerCase().includes("pdfjs/web/viewer.html");

      if (isPdfJsViewer) {
        const fileParam = u.searchParams.get("file");
        if (fileParam) {
          // fileParam 通常是 encodeURIComponent 后的 URL
          const decoded = decodeURIComponent(fileParam);

          // 有的网站会二次编码，稳妥起见再尝试一次
          const decoded2 = decoded.includes("%2F") || decoded.includes("%3A")
            ? decodeURIComponent(decoded)
            : decoded;

          // 只要像 URL，就返回（不要要求 .pdf 结尾）
          if (/^https?:\/\//i.test(decoded2) || decoded2.startsWith("/")) {
            return new URL(decoded2, window.location.href).href;
          }
        }
      }

      // 2) 直接 iframe src 就是 pdf
      if (u.href.toLowerCase().includes(".pdf")) return u.href;

      // 3) 其它常见参数：file/pdf/url/src/document
      for (const param of ["file", "pdf", "url", "src", "document"]) {
        const v = u.searchParams.get(param);
        if (!v) continue;

        const decoded = decodeURIComponent(v);
        if (/^https?:\/\//i.test(decoded) || decoded.startsWith("/")) {
          return new URL(decoded, window.location.href).href;
        }
        if (decoded.toLowerCase().includes(".pdf")) {
          return new URL(decoded, window.location.href).href;
        }
      }
    } catch (e) {
      console.error("Invalid iframe src:", src, e);
    }

    return null;
  }

  function buildAutoFilenameFromUrl(url) {
    try {
      const u = new URL(url);

      // 1) 先尝试从参数里取（适配 fetch-file 这种）
      const oss = u.searchParams.get("osslujing");   // 可能是 tzs/.../xxx.pdf
      const ds  = u.searchParams.get("ds");          // e.g., TZS
      const dm  = u.searchParams.get("wenjiandm");   // e.g., 210402
      const t   = u.searchParams.get("timestamp");   // 毫秒时间戳（可选）

      // 从 osslujing 提取 pdf 名称（不含扩展名）和申请号（如果能猜到）
      let base = "";

      if (oss) {
        // oss 里一般含 .../2021800769799/.../xxxx.pdf
        const ossDecoded = decodeURIComponent(oss);
        const parts = ossDecoded.split("/").filter(Boolean);

        // 找申请号：连续 10~14 位数字（按你示例 2021800769799）
        const appNo = parts.find(p => /^\d{10,14}$/.test(p));

        // 找 pdf 文件名
        const last = parts[parts.length - 1] || "";
        const pdfName = last.toLowerCase().endsWith(".pdf") ? last.slice(0, -4) : last;

        // 组合：CNIPA_ds_dm_appNo_pdfName（按需裁剪）
        const segs = [];
        if (appNo) segs.push(appNo);
        if (ds) segs.push(ds);
        if (dm) segs.push(dm);
        if (pdfName) segs.push(pdfName);

        base = segs.join("_");
      }

      // 2) 如果参数没拿到，就从 pathname 里找 .pdf
      if (!base) {
        const path = u.pathname || "";
        const m = path.match(/([^\/?#]+)\.pdf$/i);
        if (m) base = m[1];
      }

      // 3) 实在没有，用域名+时间兜底
      if (!base) {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        base = `${u.hostname}_${stamp}`;
      }

      // 4) 可选：如果你想用 timestamp 去重（避免重名覆盖）
      // 不建议把超长 timestamp 全塞进名字里，截断一下
      if (t && !base.includes(t)) {
        base = `${base}_${String(t).slice(-6)}`; // 只取最后6位
      }

      return base;
    } catch {
      // URL 解析失败兜底
      const now = Date.now();
      return `document_${now}`;
    }
  }

  
  // Find all links that point to PDF files
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.href;
    if (href && isPDFUrl(href)) {
      if (!pdfsMap.has(href)) {
        pdfsMap.set(href, {
          url: href,
          text: buildAutoFilenameFromUrl(href)
        });
      }
    }
  });
  
  // Find all embed and object tags with PDF sources
  const embeds = document.querySelectorAll('embed[src], object[data]');
  embeds.forEach(embed => {
    const src = embed.getAttribute('src') || embed.getAttribute('data');
    if (src) {
      const fullUrl = new URL(src, window.location.href).href;
      if (isPDFUrl(fullUrl) && !pdfsMap.has(fullUrl)) {
        pdfsMap.set(fullUrl, {
          url: fullUrl,
          text: buildAutoFilenameFromUrl(fullUrl)
        });
      }
    }
  });
  
  // Find iframes with PDF sources
  const iframes = document.querySelectorAll('iframe[src]');
  iframes.forEach(iframe => {
    const pdfUrl = getPDFUrlFromIframe(iframe);
    if (pdfUrl && !pdfsMap.has(pdfUrl)) {
      pdfsMap.set(pdfUrl, {
        url: pdfUrl,
        text: buildAutoFilenameFromUrl(pdfUrl)
      });
    }
  });
  console.log('Found PDFs:', pdfsMap);
  return Array.from(pdfsMap.values());
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
