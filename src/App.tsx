import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CategorySection } from './components/CategorySection';
import { TotalSummary } from './components/TotalSummary';
import { Calculator } from './components/Calculator';
import { ScannerModal } from './components/ScannerModal';
import { CATEGORIES, INITIAL_PRODUCTS } from './data/initialProducts';
import { DetectedPrice, Product } from './types';
import './styles/App.css';

const STORAGE_KEY = 'kasap_products_data_v1';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Price handler
  const handlePriceChange = (id: string, newPrice: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, price: newPrice } : p))
    );
  };

  // Quantity handler
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, quantity: newQuantity } : p))
    );
  };

  // Reset handler (resets quantities and default prices)
  const handleResetAll = () => {
    if (window.confirm('Tüm ürün adetlerini sıfırlamak istiyor musunuz?')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Apply OCR detected prices
  const handleApplyDetectedPrices = (detected: DetectedPrice[]) => {
    const updatedIds = new Set<string>();

    setProducts(prev =>
      prev.map(product => {
        const match = detected.find(
          d => d.name.trim().toUpperCase() === product.name.trim().toUpperCase()
        );
        if (match) {
          updatedIds.add(product.id);
          return { ...product, price: match.price };
        }
        return product;
      })
    );

    setHighlightedIds(updatedIds);
    // Remove highlights after animation finishes
    setTimeout(() => {
      setHighlightedIds(new Set());
    }, 1600);
  };

  // Calculate total price and item count
  const { total, itemCount } = useMemo(() => {
    let sum = 0;
    let count = 0;
    for (const p of products) {
      if (p.quantity > 0) {
        sum += p.price * p.quantity;
        count += p.quantity;
      }
    }
    return { total: sum, itemCount: count };
  }, [products]);

  return (
    <>
      <Header
        onOpenScanner={() => setIsScannerOpen(true)}
        onResetAll={handleResetAll}
      />

      <div className="content-wrapper">
        <div className="products-section">
          {CATEGORIES.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              products={products}
              onPriceChange={handlePriceChange}
              onQuantityChange={handleQuantityChange}
              highlightedProductIds={highlightedIds}
            />
          ))}

          <TotalSummary total={total} itemCount={itemCount} />
        </div>

        <Calculator />
      </div>

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        products={products}
        onApplyPrices={handleApplyDetectedPrices}
      />
    </>
  );
};

export default App;
