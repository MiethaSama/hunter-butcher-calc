import React from 'react';
import { Product } from '../types';

interface ProductRowProps {
  product: Product;
  onPriceChange: (id: string, newPrice: number) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
  isHighlighted?: boolean;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onPriceChange,
  onQuantityChange,
  isHighlighted
}) => {
  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onPriceChange(product.id, Math.max(0, val));
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0;
    onQuantityChange(product.id, Math.max(0, val));
  };

  const increment = () => onQuantityChange(product.id, product.quantity + 1);
  const decrement = () => onQuantityChange(product.id, Math.max(0, product.quantity - 1));

  return (
    <div className="item-row">
      <div className="item-name">{product.name}</div>

      <div className="item-price-container">
        <span className="currency-symbol">$</span>
        <input
          type="number"
          className={`item-price-input ${isHighlighted ? 'price-updated-highlight' : ''}`}
          min="0"
          value={product.price || ''}
          onChange={handlePriceInput}
        />
      </div>

      <div className="item-quantity-wrapper">
        <button className="qty-step-btn" onClick={decrement} type="button">-</button>
        <input
          type="number"
          className="item-quantity"
          min="0"
          value={product.quantity === 0 ? '' : product.quantity}
          placeholder="0"
          onChange={handleQuantityInput}
        />
        <button className="qty-step-btn" onClick={increment} type="button">+</button>
      </div>
    </div>
  );
};
