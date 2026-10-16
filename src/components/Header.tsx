import React from 'react';

interface HeaderProps {
  onOpenScanner: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenScanner, onResetAll }) => {
  return (
    <>
      <div className="header-container">
        <h1 className="red-text">KASAP</h1>
        <span className="deer-icon">🦌</span>
      </div>

      <div className="actions-bar">
        <button className="action-btn scan-btn" onClick={onOpenScanner}>
          <span>📸</span> Fiyat Listesi Tara (OCR)
        </button>
        <button className="action-btn reset-btn" onClick={onResetAll} title="Tüm adetleri ve fiyatları sıfırla">
          <span>🔄</span> Sıfırla
        </button>
      </div>
    </>
  );
};
