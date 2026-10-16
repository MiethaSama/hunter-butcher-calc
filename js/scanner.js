// Client-side OCR Price Scanner using Tesseract.js (No API key needed!)

let currentImageDataUrl = null;
let detectedItems = [];

// Specificity order: test DERİ, SÜT, BOYNUZ, KÜRK, YAĞ before general ET
const PRODUCT_RULES = [
    { name: 'GEYİK BOYNUZU', patterns: ['BOYNUZ'] },
    { name: 'GEYİK KÜRKÜ', patterns: ['KÜRK', 'KURK'] },
    { name: 'İNEK SÜTÜ', patterns: ['SÜT', 'SUT'] },
    { name: 'DOMUZ YAĞI', patterns: ['YAĞ', 'YAG'] },
    { name: 'İNEK DERİSİ', patterns: ['İNEK DER', 'INEK DER'] },
    { name: 'DOMUZ DERİSİ', patterns: ['DOMUZ DER'] },
    { name: 'TİLKİ DERİSİ', patterns: ['TİLKİ DER', 'TILKI DER'] },
    { name: 'TAVŞAN DERİSİ', patterns: ['TAVŞAN DER', 'TAVSAN DER'] },
    { name: 'ASLAN-PANTER ETİ', patterns: ['ASLAN', 'PANTER'] },
    { name: 'İNEK ETİ', patterns: ['İNEK', 'INEK'] },
    { name: 'GEYİK ETİ', patterns: ['GEYİK', 'GEYIK'] },
    { name: 'DOMUZ ETİ', patterns: ['DOMUZ'] },
    { name: 'TİLKİ ETİ', patterns: ['TİLKİ', 'TILKI'] },
    { name: 'TAVŞAN ETİ', patterns: ['TAVŞAN', 'TAVSAN'] },
    { name: 'TAVUK ETİ', patterns: ['TAVUK'] }
];

function initScanner() {
    const openScannerBtn = document.getElementById('openScannerBtn');
    const scannerModal = document.getElementById('scannerModal');
    const closeScannerBtn = document.getElementById('closeScannerBtn');

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImgBtn = document.getElementById('removeImgBtn');

    const startScanBtn = document.getElementById('startScanBtn');
    const applyPricesBtn = document.getElementById('applyPricesBtn');
    const scanResults = document.getElementById('scanResults');

    // Open/Close Modal
    if (openScannerBtn && scannerModal) {
        openScannerBtn.addEventListener('click', () => {
            scannerModal.classList.add('active');
        });
    }

    if (closeScannerBtn && scannerModal) {
        closeScannerBtn.addEventListener('click', () => {
            scannerModal.classList.remove('active');
        });
    }

    if (scannerModal) {
        scannerModal.addEventListener('click', (e) => {
            if (e.target === scannerModal) {
                scannerModal.classList.remove('active');
            }
        });
    }

    // Drag & Drop / File Input
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleImageFile(e.target.files[0]);
            }
        });
    }

    // Clipboard Paste (Ctrl+V) support
    window.addEventListener('paste', (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    if (scannerModal) scannerModal.classList.add('active');
                    handleImageFile(file);
                }
                break;
            }
        }
    });

    // Remove Image
    if (removeImgBtn) {
        removeImgBtn.addEventListener('click', resetScannerState);
    }

    // Start Scan Button
    if (startScanBtn) {
        startScanBtn.addEventListener('click', runClientOCR);
    }

    // Apply Prices Button
    if (applyPricesBtn) {
        applyPricesBtn.addEventListener('click', applyDetectedPrices);
    }
}

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir görsel (PNG, JPG, WebP) yükleyin.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageDataUrl = e.target.result;

        const dropZone = document.getElementById('dropZone');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const imagePreview = document.getElementById('imagePreview');
        const startScanBtn = document.getElementById('startScanBtn');
        const scanResults = document.getElementById('scanResults');

        if (imagePreview) imagePreview.src = currentImageDataUrl;
        if (dropZone) dropZone.style.display = 'none';
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
        if (startScanBtn) startScanBtn.disabled = false;
        if (scanResults) scanResults.style.display = 'none';
    };

    reader.readAsDataURL(file);
}

function resetScannerState() {
    currentImageDataUrl = null;
    detectedItems = [];

    const dropZone = document.getElementById('dropZone');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const fileInput = document.getElementById('fileInput');
    const startScanBtn = document.getElementById('startScanBtn');
    const scanResults = document.getElementById('scanResults');
    const scanLoading = document.getElementById('scanLoading');

    if (fileInput) fileInput.value = '';
    if (imagePreview) imagePreview.src = '';
    if (dropZone) dropZone.style.display = 'block';
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    if (startScanBtn) {
        startScanBtn.disabled = true;
        startScanBtn.style.display = 'inline-block';
    }
    if (scanResults) scanResults.style.display = 'none';
    if (scanLoading) scanLoading.style.display = 'none';
}

// Client-side OCR using Tesseract.js (no API key needed!)
async function runClientOCR() {
    if (!currentImageDataUrl) {
        alert('Lütfen taranacak bir görsel seçin.');
        return;
    }

    if (typeof Tesseract === 'undefined') {
        alert('OCR kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edip sayfayı yenileyin.');
        return;
    }

    const startScanBtn = document.getElementById('startScanBtn');
    const scanLoading = document.getElementById('scanLoading');
    const scanResults = document.getElementById('scanResults');
    const progressBar = document.getElementById('scanProgressBar');
    const loadingText = document.getElementById('loadingText');
    const resultsList = document.getElementById('resultsList');
    const resultsCount = document.getElementById('resultsCount');

    if (startScanBtn) startScanBtn.style.display = 'none';
    if (scanLoading) scanLoading.style.display = 'block';
    if (scanResults) scanResults.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';
    if (loadingText) loadingText.innerText = 'Tarayıcı OCR başlatılıyor...';

    try {
        const result = await Tesseract.recognize(
            currentImageDataUrl,
            'tur+eng',
            {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round((m.progress || 0) * 100);
                        if (progressBar) progressBar.style.width = `${progress}%`;
                        if (loadingText) loadingText.innerText = `Yazılar ve fiyatlar taranıyor... %${progress}`;
                    } else if (m.status) {
                        if (loadingText) loadingText.innerText = 'Görsel işleniyor...';
                    }
                }
            }
        );

        const recognizedText = result.data.text || '';
        detectedItems = parsePricesFromOCR(recognizedText);

        if (scanLoading) scanLoading.style.display = 'none';

        if (detectedItems.length === 0) {
            alert('Görselde fiyatı tespit edilen ürün bulunamadı. Lütfen görselin net olduğundan veya yazıların okunabilir olduğundan emin olun.');
            if (startScanBtn) startScanBtn.style.display = 'inline-block';
            return;
        }

        // Render detected items with editable price inputs
        if (resultsList) {
            resultsList.innerHTML = detectedItems.map((item, index) => `
                <div class="result-item">
                    <span class="result-name">🥩 ${escapeHtml(item.name)}</span>
                    <div class="result-price-wrapper">
                        <span>$</span>
                        <input type="number" class="result-price-input" data-index="${index}" value="${item.price}" min="0">
                    </div>
                </div>
            `).join('');

            // Listen for user edits in modal
            resultsList.querySelectorAll('.result-price-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const idx = parseInt(e.target.dataset.index, 10);
                    const val = parseFloat(e.target.value) || 0;
                    if (detectedItems[idx]) {
                        detectedItems[idx].price = val;
                    }
                });
            });
        }

        if (resultsCount) {
            resultsCount.innerText = `${detectedItems.length} Ürün Bulundu`;
        }

        if (scanResults) scanResults.style.display = 'block';

    } catch (err) {
        if (scanLoading) scanLoading.style.display = 'none';
        if (startScanBtn) startScanBtn.style.display = 'inline-block';
        alert('OCR tarama sırasında hata oluştu: ' + (err.message || err));
    }
}

// Parse text lines to match products and extract numbers
function parsePricesFromOCR(rawText) {
    const rawLines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const matches = [];
    const matchedNames = new Set();

    rawLines.forEach((line, lineIndex) => {
        const normalizedLine = turkishToUpper(line);

        for (const rule of PRODUCT_RULES) {
            if (matchedNames.has(rule.name)) continue;

            const isMatch = rule.patterns.some(pattern => normalizedLine.includes(turkishToUpper(pattern)));

            if (isMatch) {
                // Try to find numbers in this line
                let price = extractNumberFromText(line);

                // If not found in current line, check adjacent line
                if (price === null && lineIndex + 1 < rawLines.length) {
                    price = extractNumberFromText(rawLines[lineIndex + 1]);
                }

                if (price !== null && price > 0) {
                    matchedNames.add(rule.name);
                    matches.push({
                        name: rule.name,
                        price: price
                    });
                    break;
                }
            }
        }
    });

    return matches;
}

// Extract the most probable price number from a string
function extractNumberFromText(str) {
    // Replace typical OCR letter-number confusions: 'O' or 'o' between numbers
    const cleanStr = str.replace(/(\d)[oO](\d)/g, '$10$2');
    // Match numbers like 1050, 1.050, 850, 70
    const numberMatches = cleanStr.match(/\b\d{1,3}(?:[.,]\d{3})*\b|\b\d+\b/g);

    if (!numberMatches || numberMatches.length === 0) return null;

    // Filter out 0 and pick last number on line (prices usually at the end)
    for (let i = numberMatches.length - 1; i >= 0; i--) {
        const rawNum = numberMatches[i].replace(/[.,]/g, '');
        const parsed = parseInt(rawNum, 10);
        if (parsed > 0) {
            return parsed;
        }
    }

    return null;
}

// Turkish character-aware uppercase conversion
function turkishToUpper(str) {
    return str
        .replace(/i/g, 'İ')
        .replace(/ı/g, 'I')
        .toUpperCase();
}

// Apply detected prices to table inputs
function applyDetectedPrices() {
    if (!detectedItems || detectedItems.length === 0) return;

    let updatedCount = 0;
    const itemRows = document.querySelectorAll('.item-row');

    detectedItems.forEach(item => {
        itemRows.forEach(row => {
            const nameEl = row.querySelector('.item-name');
            const priceInput = row.querySelector('.item-price-input');

            if (nameEl && priceInput) {
                const rowName = nameEl.innerText.trim().toUpperCase();
                const targetName = (item.name || '').trim().toUpperCase();

                if (rowName === targetName) {
                    priceInput.value = item.price;
                    updatedCount++;

                    // Visual highlight animation
                    priceInput.classList.remove('price-updated-highlight');
                    void priceInput.offsetWidth; // trigger reflow
                    priceInput.classList.add('price-updated-highlight');
                }
            }
        });
    });

    // Recalculate total with new prices
    if (typeof window.calculateTotal === 'function') {
        window.calculateTotal();
    }

    const scannerModal = document.getElementById('scannerModal');
    if (scannerModal) scannerModal.classList.remove('active');
    resetScannerState();
    alert(`Harika! ${updatedCount} ürünün fiyatı güncellendi ve sepet tutarı yeniden hesaplandı.`);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScanner);
} else {
    initScanner();
}
