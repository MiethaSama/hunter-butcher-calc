import React, { useState, useEffect, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { DetectedPrice, Product } from '../types';
import '../styles/Scanner.css';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onApplyPrices: (detected: DetectedPrice[]) => void;
}

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

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyPrices
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [detectedItems, setDetectedItems] = useState<DetectedPrice[]>([]);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste support
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            loadFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir görsel (PNG, JPG, WebP) yükleyin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setDetectedItems([]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const handleScan = async () => {
    if (!imageSrc) return;

    setIsScanning(true);
    setProgress(0);
    setStatusText('OCR Motoru başlatılıyor...');

    try {
      const worker = await createWorker('tur+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const p = Math.round((m.progress || 0) * 100);
            setProgress(p);
            setStatusText(`Yazılar taranıyor... %${p}`);
          }
        }
      });

      const ret = await worker.recognize(imageSrc);
      await worker.terminate();

      const text = ret.data.text || '';
      const parsed = parsePrices(text);

      setIsScanning(false);

      if (parsed.length === 0) {
        alert('Görselde fiyatı tespit edilen ürün bulunamadı. Lütfen görselin net olduğundan emin olun.');
        return;
      }

      setDetectedItems(parsed);
    } catch (err: unknown) {
      setIsScanning(false);
      alert('Tarama sırasında hata oluştu: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const parsePrices = (rawText: string): DetectedPrice[] => {
    const rawLines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const matches: DetectedPrice[] = [];
    const matchedNames = new Set<string>();

    rawLines.forEach((line, lineIndex) => {
      const normalizedLine = turkishToUpper(line);

      for (const rule of PRODUCT_RULES) {
        if (matchedNames.has(rule.name)) continue;

        const isMatch = rule.patterns.some(pattern => normalizedLine.includes(turkishToUpper(pattern)));

        if (isMatch) {
          let price = extractNumber(line);
          if (price === null && lineIndex + 1 < rawLines.length) {
            price = extractNumber(rawLines[lineIndex + 1]);
          }

          if (price !== null && price > 0) {
            matchedNames.add(rule.name);
            matches.push({ name: rule.name, price });
            break;
          }
        }
      }
    });

    return matches;
  };

  const extractNumber = (str: string): number | null => {
    const cleanStr = str.replace(/(\d)[oO](\d)/g, '$10$2');
    const numberMatches = cleanStr.match(/\b\d{1,3}(?:[.,]\d{3})*\b|\b\d+\b/g);
    if (!numberMatches || numberMatches.length === 0) return null;

    for (let i = numberMatches.length - 1; i >= 0; i--) {
      const rawNum = numberMatches[i].replace(/[.,]/g, '');
      const parsed = parseInt(rawNum, 10);
      if (parsed > 0) return parsed;
    }
    return null;
  };

  const turkishToUpper = (str: string) => {
    return str.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
  };

  const handlePriceEdit = (index: number, newPrice: number) => {
    setDetectedItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], price: Math.max(0, newPrice) };
      return updated;
    });
  };

  const handleApply = () => {
    onApplyPrices(detectedItems);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setImageSrc(null);
    setDetectedItems([]);
    setIsScanning(false);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">📸 Fotoğraftan Fiyat Listesi Tara</h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {!imageSrc ? (
          <div
            className={`drop-zone ${dragOver ? 'dragover' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <span className="drop-zone-icon">📁</span>
            <div className="drop-zone-text">Fotoğrafı buraya sürükleyin veya tıklayıp seçin</div>
            <div className="drop-zone-subtext">PNG, JPG, WebP veya ekran görüntüsünü <strong>Ctrl+V</strong> ile yapıştırın</div>
            <input
              type="file"
              ref={fileInputRef}
              className="file-input"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="image-preview-container">
            <img src={imageSrc} className="image-preview-img" alt="Önizleme" />
            <button className="remove-img-btn" onClick={handleReset} title="Görseli Kaldır">&times;</button>
          </div>
        )}

        {isScanning && (
          <div className="scan-loading">
            <div className="spinner"></div>
            <div className="loading-text">{statusText}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {detectedItems.length > 0 && (
          <div className="scan-results">
            <div className="results-header">
              <span>✅</span> <span>{detectedItems.length} Ürün Bulundu</span>
            </div>
            <div className="results-list">
              {detectedItems.map((item, idx) => (
                <div key={idx} className="result-item">
                  <span className="result-name">🥩 {item.name}</span>
                  <div className="result-price-wrapper">
                    <span>$</span>
                    <input
                      type="number"
                      className="result-price-input"
                      value={item.price}
                      min="0"
                      onChange={(e) => handlePriceEdit(idx, parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions" style={{ marginTop: '15px' }}>
              <button className="btn-primary" onClick={handleApply}>Fiyatları Uygula</button>
            </div>
          </div>
        )}

        {imageSrc && !isScanning && detectedItems.length === 0 && (
          <div className="modal-actions" style={{ marginTop: '15px' }}>
            <button className="btn-primary" onClick={handleScan}>Taramayı Başlat</button>
          </div>
        )}
      </div>
    </div>
  );
};
