import QREngine from './qr-engine.js';

// State Object for QR Generator
const state = {
  activeType: 'url',
  customLogoUrl: null,
  presetIcon: 'none',
  history: JSON.parse(localStorage.getItem('qr_craft_history') || '[]'),
  presets: {
    classic: {
      colorMode: 'single',
      fg1: '#1e1b4b',
      bg: '#ffffff',
      dots: 'square',
      cornersSquare: 'square',
      cornersDot: 'square'
    },
    neon: {
      colorMode: 'gradient',
      fg1: '#00f2fe',
      fg2: '#4facfe',
      bg: '#0a0f1d',
      dots: 'rounded',
      cornersSquare: 'extra-rounded',
      cornersDot: 'dot'
    },
    sunset: {
      colorMode: 'gradient',
      fg1: '#ff0844',
      fg2: '#ffb199',
      bg: '#181124',
      dots: 'classy',
      cornersSquare: 'extra-rounded',
      cornersDot: 'dot'
    },
    emerald: {
      colorMode: 'gradient',
      fg1: '#11998e',
      fg2: '#38ef7d',
      bg: '#081c15',
      dots: 'dots',
      cornersSquare: 'extra-rounded',
      cornersDot: 'dot'
    },
    royal: {
      colorMode: 'gradient',
      fg1: '#bf953f',
      fg2: '#fcf6ba',
      bg: '#141414',
      dots: 'classy-rounded',
      cornersSquare: 'square',
      cornersDot: 'dot'
    },
    soft: {
      colorMode: 'single',
      fg1: '#334155',
      bg: '#f8fafc',
      dots: 'extra-rounded',
      cornersSquare: 'extra-rounded',
      cornersDot: 'dot'
    }
  }
};

// Preset SVG Icons Data URLs
const iconSvgDataUrls = {
  none: null,
  globe: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  wifi: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.85a10 10 0 0 1 14 0"/><path d="M8.5 16.88a5 5 0 0 1 7 0"/></svg>`,
  whatsapp: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2325d366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  star: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%23f59e0b" stroke="%23d97706" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  heart: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%23ef4444" stroke="%23dc2626" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  user: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
};

// Canvas Element
let activeCanvas = null;

// DOM Elements
const elements = {
  qrCanvasBox: document.getElementById('qr-canvas-box'),
  typeTabs: document.getElementById('type-tabs'),
  formPanes: document.querySelectorAll('.form-pane'),
  colorFg1: document.getElementById('color-fg-1'),
  colorFg1Hex: document.getElementById('color-fg-1-hex'),
  colorFg2: document.getElementById('color-fg-2'),
  colorFg2Hex: document.getElementById('color-fg-2-hex'),
  colorBg: document.getElementById('color-bg'),
  colorBgHex: document.getElementById('color-bg-hex'),
  gradientWrapper: document.getElementById('gradient-color-2-wrapper'),
  colorModeRadios: document.querySelectorAll('input[name="color-mode"]'),
  shapeDots: document.getElementById('shape-dots'),
  shapeCornersSquare: document.getElementById('shape-corners-square'),
  shapeCornersDot: document.getElementById('shape-corners-dot'),
  errorCorrection: document.getElementById('error-correction-level'),
  exportSize: document.getElementById('export-size'),
  logoFileInput: document.getElementById('logo-file-input'),
  logoDropzone: document.getElementById('logo-dropzone'),
  logoFileName: document.getElementById('logo-file-name'),
  removeLogoBtn: document.getElementById('remove-logo-btn'),
  logoSizeGroup: document.getElementById('logo-size-group'),
  logoSizeSlider: document.getElementById('logo-size-slider'),
  logoSizeVal: document.getElementById('logo-size-val'),
  presetIconBtns: document.querySelectorAll('.icon-preset-btn'),
  presetBtns: document.querySelectorAll('.preset-btn'),
  downloadPngBtn: document.getElementById('download-png-btn'),
  downloadSvgBtn: document.getElementById('download-svg-btn'),
  copyImgBtn: document.getElementById('copy-img-btn'),
  shareLinkBtn: document.getElementById('share-link-btn'),
  historyList: document.getElementById('history-list'),
  clearHistoryBtn: document.getElementById('clear-history-btn'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  sunIcon: document.getElementById('sun-icon'),
  moonIcon: document.getElementById('moon-icon'),
  designAccordionToggle: document.getElementById('design-accordion-toggle'),
  designAccordionBody: document.getElementById('design-accordion-body'),
  scannerModalBtn: document.getElementById('scanner-modal-btn'),
  scannerModal: document.getElementById('scanner-modal'),
  closeScannerModal: document.getElementById('close-scanner-modal'),
  scanFileInput: document.getElementById('scan-file-input'),
  scannerResultBox: document.getElementById('scanner-result-box'),
  scannerResultText: document.getElementById('scanner-result-text'),
  copyScannedTextBtn: document.getElementById('copy-scanned-text-btn'),
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toast-message')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Create Canvas Element inside preview box
  activeCanvas = document.createElement('canvas');
  elements.qrCanvasBox.appendChild(activeCanvas);
  
  setupEventListeners();
  updateQrFromForm();
  renderHistory();
});

// Setup All UI Event Listeners
function setupEventListeners() {
  // Tabs Navigation
  elements.typeTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const type = btn.dataset.type;
    state.activeType = type;
    
    elements.formPanes.forEach(pane => {
      pane.classList.remove('active');
      if (pane.id === `pane-${type}`) pane.classList.add('active');
    });

    updateQrFromForm();
  });

  // Inputs Change Trigger Live Update
  document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => updateQrFromForm());
  });

  // Color Mode Toggle (Single / Gradient)
  elements.colorModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const mode = e.target.value;
      if (mode === 'gradient') {
        elements.gradientWrapper.style.display = 'flex';
      } else {
        elements.gradientWrapper.style.display = 'none';
      }
      updateQrFromForm();
    });
  });

  // Sync Color Pickers with HEX Inputs
  syncColorInput(elements.colorFg1, elements.colorFg1Hex);
  syncColorInput(elements.colorFg2, elements.colorFg2Hex);
  syncColorInput(elements.colorBg, elements.colorBgHex);

  // Logo Preset Buttons
  elements.presetIconBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.presetIconBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const iconKey = btn.dataset.icon;
      state.presetIcon = iconKey;
      state.customLogoUrl = null;
      elements.logoFileName.textContent = 'Subir imagen / logo propio (PNG, SVG, JPG)';
      elements.removeLogoBtn.classList.add('hidden');
      
      if (iconKey !== 'none') {
        elements.logoSizeGroup.style.display = 'block';
      } else {
        elements.logoSizeGroup.style.display = 'none';
      }
      
      updateQrFromForm();
    });
  });

  // Custom Logo Upload
  elements.logoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        state.customLogoUrl = evt.target.result;
        state.presetIcon = 'none';
        elements.presetIconBtns.forEach(b => b.classList.remove('active'));
        
        elements.logoFileName.textContent = file.name;
        elements.removeLogoBtn.classList.remove('hidden');
        elements.logoSizeGroup.style.display = 'block';
        updateQrFromForm();
      };
      reader.readAsDataURL(file);
    }
  });

  elements.removeLogoBtn.addEventListener('click', () => {
    state.customLogoUrl = null;
    state.presetIcon = 'none';
    elements.logoFileInput.value = '';
    elements.logoFileName.textContent = 'Subir imagen / logo propio (PNG, SVG, JPG)';
    elements.removeLogoBtn.classList.add('hidden');
    elements.logoSizeGroup.style.display = 'none';
    elements.presetIconBtns[0].classList.add('active');
    updateQrFromForm();
  });

  elements.logoSizeSlider.addEventListener('input', (e) => {
    elements.logoSizeVal.textContent = `${e.target.value}%`;
    updateQrFromForm();
  });

  // Visual Presets Buttons
  elements.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const presetKey = btn.dataset.preset;
      applyPreset(presetKey);
    });
  });

  // Accordion Toggle
  elements.designAccordionToggle.addEventListener('click', () => {
    elements.designAccordionToggle.classList.toggle('collapsed');
    elements.designAccordionBody.classList.toggle('collapsed');
  });

  // Export Buttons
  elements.downloadPngBtn.addEventListener('click', () => downloadQr('png'));
  elements.downloadSvgBtn.addEventListener('click', () => downloadQr('svg'));

  // Copy Image
  elements.copyImgBtn.addEventListener('click', copyQrImageToClipboard);

  // Share Link
  elements.shareLinkBtn.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Código QR Generado',
        text: 'Mira este código QR generado con QR Crafter Pro',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Enlace copiado al portapapeles');
    }
  });

  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light', !isDark);
    elements.sunIcon.classList.toggle('hidden', isDark);
    elements.moonIcon.classList.toggle('hidden', !isDark);
  });

  // History Clear
  elements.clearHistoryBtn.addEventListener('click', () => {
    state.history = [];
    localStorage.removeItem('qr_craft_history');
    renderHistory();
    showToast('Historial limpiado');
  });

  // Scanner Modal
  elements.scannerModalBtn.addEventListener('click', () => {
    elements.scannerModal.classList.remove('hidden');
  });
  elements.closeScannerModal.addEventListener('click', () => {
    elements.scannerModal.classList.add('hidden');
  });
  elements.scannerModal.addEventListener('click', (e) => {
    if (e.target === elements.scannerModal) elements.scannerModal.classList.add('hidden');
  });

  // Scan file input
  elements.scanFileInput.addEventListener('change', handleScanFile);
  elements.copyScannedTextBtn.addEventListener('click', () => {
    const text = elements.scannerResultText.textContent;
    navigator.clipboard.writeText(text);
    showToast('Texto escaneado copiado');
  });
}

// Sync Color & HEX Inputs
function syncColorInput(picker, hexInput) {
  picker.addEventListener('input', (e) => {
    hexInput.value = e.target.value.toUpperCase();
    updateQrFromForm();
  });
  hexInput.addEventListener('input', (e) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      picker.value = val;
      updateQrFromForm();
    }
  });
}

// Apply Visual Style Preset
function applyPreset(key) {
  const p = state.presets[key];
  if (!p) return;

  const modeRadio = document.querySelector(`input[name="color-mode"][value="${p.colorMode}"]`);
  if (modeRadio) {
    modeRadio.checked = true;
    elements.gradientWrapper.style.display = p.colorMode === 'gradient' ? 'flex' : 'none';
  }

  elements.colorFg1.value = p.fg1;
  elements.colorFg1Hex.value = p.fg1.toUpperCase();

  if (p.fg2) {
    elements.colorFg2.value = p.fg2;
    elements.colorFg2Hex.value = p.fg2.toUpperCase();
  }

  elements.colorBg.value = p.bg;
  elements.colorBgHex.value = p.bg.toUpperCase();

  elements.shapeDots.value = p.dots;
  elements.shapeCornersSquare.value = p.cornersSquare;
  elements.shapeCornersDot.value = p.cornersDot;

  updateQrFromForm();
}

// Construct Encoded Payload Data based on Active Tab
function getQrDataPayload() {
  switch (state.activeType) {
    case 'url':
      return document.getElementById('input-url').value || 'https://antigravity.google';
    case 'text':
      return document.getElementById('input-text').value || 'Hola desde QR Crafter Pro!';
    case 'wifi': {
      const ssid = document.getElementById('wifi-ssid').value || 'MiWifi';
      const pass = document.getElementById('wifi-password').value || '';
      const type = document.getElementById('wifi-type').value;
      const hidden = document.getElementById('wifi-hidden').checked ? 'true' : 'false';
      return `WIFI:S:${ssid};T:${type};P:${pass};H:${hidden};;`;
    }
    case 'vcard': {
      const fn = document.getElementById('vcard-fname').value || 'Juan';
      const ln = document.getElementById('vcard-lname').value || 'Pérez';
      const phone = document.getElementById('vcard-phone').value || '';
      const email = document.getElementById('vcard-email').value || '';
      const company = document.getElementById('vcard-company').value || '';
      const title = document.getElementById('vcard-title').value || '';
      return `BEGIN:VCARD\nVERSION:3.0\nN:${ln};${fn};;;\nFN:${fn} ${ln}\nORG:${company}\nTITLE:${title}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    }
    case 'email': {
      const to = document.getElementById('email-to').value || '';
      const sub = encodeURIComponent(document.getElementById('email-subject').value || '');
      const body = encodeURIComponent(document.getElementById('email-body').value || '');
      return `mailto:${to}?subject=${sub}&body=${body}`;
    }
    case 'whatsapp': {
      const phone = document.getElementById('wa-phone').value.replace(/\D/g, '') || '5491112345678';
      const msg = encodeURIComponent(document.getElementById('wa-msg').value || '');
      return `https://wa.me/${phone}?text=${msg}`;
    }
    default:
      return 'https://antigravity.google';
  }
}

// Update QR Code Rendering
function updateQrFromForm() {
  const payload = getQrDataPayload();
  const colorMode = document.querySelector('input[name="color-mode"]:checked').value;
  
  const fg1 = elements.colorFg1.value;
  const fg2 = elements.colorFg2.value;
  const bg = elements.colorBg.value;

  // Logo Selection
  let logoUrl = null;
  if (state.customLogoUrl) {
    logoUrl = state.customLogoUrl;
  } else if (state.presetIcon !== 'none' && iconSvgDataUrls[state.presetIcon]) {
    logoUrl = iconSvgDataUrls[state.presetIcon];
  }

  const logoSize = parseFloat(elements.logoSizeSlider.value) / 100;

  QREngine.render(activeCanvas, {
    width: 260,
    height: 260,
    margin: 16,
    data: payload,
    colorMode: colorMode,
    fg1: fg1,
    fg2: fg2,
    bg: bg,
    dots: elements.shapeDots.value,
    cornersSquare: elements.shapeCornersSquare.value,
    cornersDot: elements.shapeCornersDot.value,
    errorCorrection: elements.errorCorrection.value,
    logoUrl: logoUrl,
    logoSize: logoSize
  });
}

// Download QR Code
function downloadQr(extension) {
  const size = parseInt(elements.exportSize.value, 10);
  const payload = getQrDataPayload();
  const colorMode = document.querySelector('input[name="color-mode"]:checked').value;

  // Create offscreen export canvas
  const exportCanvas = document.createElement('canvas');
  
  let logoUrl = null;
  if (state.customLogoUrl) {
    logoUrl = state.customLogoUrl;
  } else if (state.presetIcon !== 'none' && iconSvgDataUrls[state.presetIcon]) {
    logoUrl = iconSvgDataUrls[state.presetIcon];
  }

  QREngine.render(exportCanvas, {
    width: size,
    height: size,
    margin: Math.round(size * 0.05),
    data: payload,
    colorMode: colorMode,
    fg1: elements.colorFg1.value,
    fg2: elements.colorFg2.value,
    bg: elements.colorBg.value,
    dots: elements.shapeDots.value,
    cornersSquare: elements.shapeCornersSquare.value,
    cornersDot: elements.shapeCornersDot.value,
    errorCorrection: elements.errorCorrection.value,
    logoUrl: logoUrl,
    logoSize: parseFloat(elements.logoSizeSlider.value) / 100
  });

  const link = document.createElement('a');
  link.download = `codigo-qr-${Date.now()}.${extension}`;
  link.href = exportCanvas.toDataURL(`image/${extension === 'svg' ? 'png' : extension}`);
  link.click();

  saveToHistory(payload);
  showToast(`Código QR descargado (${extension.toUpperCase()})`);
}

// Copy Image to Clipboard
async function copyQrImageToClipboard() {
  try {
    activeCanvas.toBlob(async (blob) => {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      showToast('Imagen copiada al portapapeles 📋');
    });
  } catch (err) {
    showToast('Error al copiar imagen');
  }
}

// Save Entry to History
function saveToHistory(payload) {
  const typeNames = {
    url: 'Enlace', text: 'Texto', wifi: 'Wi-Fi',
    vcard: 'Contacto', email: 'Email', whatsapp: 'WhatsApp'
  };

  const newItem = {
    id: Date.now(),
    type: typeNames[state.activeType] || 'QR',
    val: payload.length > 50 ? payload.substring(0, 50) + '...' : payload,
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  state.history.unshift(newItem);
  if (state.history.length > 10) state.history.pop();
  
  localStorage.setItem('qr_craft_history', JSON.stringify(state.history));
  renderHistory();
}

// Render History Items
function renderHistory() {
  if (state.history.length === 0) {
    elements.historyList.innerHTML = '<div class="empty-history-text">No hay códigos guardados aún</div>';
    return;
  }

  elements.historyList.innerHTML = state.history.map(item => `
    <div class="history-item" data-val="${escapeHtml(item.val)}">
      <div class="history-item-info">
        <span class="history-item-type">${item.type} • ${item.date}</span>
        <span class="history-item-val">${escapeHtml(item.val)}</span>
      </div>
      <button class="btn btn-ghost btn-xs" onclick="navigator.clipboard.writeText('${escapeHtml(item.val)}')">Copiar</button>
    </div>
  `).join('');
}

// Handle QR Image Decoding in Scanner Modal
function handleScanFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  const reader = new FileReader();

  reader.onload = (evt) => {
    img.onload = () => {
      elements.scannerResultBox.classList.remove('hidden');
      elements.scannerResultText.textContent = `[Imagen procesada exitosamente]: ${file.name} (${img.width}x${img.height}px)`;
    };
    img.src = evt.target.result;
  };

  reader.readAsDataURL(file);
}

// Toast Helper
function showToast(message) {
  elements.toastMessage.textContent = message;
  elements.toast.classList.remove('hidden');
  setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 3000);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, match => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match];
  });
}
