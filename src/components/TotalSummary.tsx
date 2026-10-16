import React from 'react';

interface TotalSummaryProps {
  total: number;
  itemCount: number;
}

export const TotalSummary: React.FC<TotalSummaryProps> = ({ total, itemCount }) => {
  return (
    <div className="total-container">
      <div>
        <span>TOPLAM:</span>
        {itemCount > 0 && (
          <span style={{ fontSize: '0.65em', color: '#aaa', marginLeft: '10px', fontWeight: 'normal' }}>
            ({itemCount} adet ürün)
          </span>
        )}
      </div>
      <div className="total-price">${total.toLocaleString('tr-TR')}</div>
    </div>
  );
};
