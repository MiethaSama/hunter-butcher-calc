import React from 'react';
import { Category, Product } from '../types';
import { ProductRow } from './ProductRow';

interface CategorySectionProps {
  category: Category;
  products: Product[];
  onPriceChange: (id: string, newPrice: number) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
  highlightedProductIds: Set<string>;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  products,
  onPriceChange,
  onQuantityChange,
  highlightedProductIds
}) => {
  const categoryProducts = products.filter(p => p.category === category.id);

  if (categoryProducts.length === 0) return null;

  return (
    <div className="category">
      <div className="category-title">
        <span>{category.icon}</span> {category.title}
      </div>

      {categoryProducts.map(product => (
        <ProductRow
          key={product.id}
          product={product}
          onPriceChange={onPriceChange}
          onQuantityChange={onQuantityChange}
          isHighlighted={highlightedProductIds.has(product.id)}
        />
      ))}
    </div>
  );
};
