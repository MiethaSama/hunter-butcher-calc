import { Category, Product } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'meat', title: 'ET FİYATLARI', icon: '🥩' },
  { id: 'fur', title: 'DERİ-KÜRK-BOYNUZ FİYATLARI', icon: '🦌' },
  { id: 'dairy', title: 'SÜT VE YAĞ FİYATLARI', icon: '🥛' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Meat
  { id: 'cow-meat', name: 'İNEK ETİ', category: 'meat', defaultPrice: 1050, price: 1050, quantity: 0 },
  { id: 'deer-meat', name: 'GEYİK ETİ', category: 'meat', defaultPrice: 850, price: 850, quantity: 0 },
  { id: 'lion-meat', name: 'ASLAN-PANTER ETİ', category: 'meat', defaultPrice: 850, price: 850, quantity: 0 },
  { id: 'pig-meat', name: 'DOMUZ ETİ', category: 'meat', defaultPrice: 400, price: 400, quantity: 0 },
  { id: 'fox-meat', name: 'TİLKİ ETİ', category: 'meat', defaultPrice: 350, price: 350, quantity: 0 },
  { id: 'rabbit-meat', name: 'TAVŞAN ETİ', category: 'meat', defaultPrice: 70, price: 70, quantity: 0 },
  { id: 'chicken-meat', name: 'TAVUK ETİ', category: 'meat', defaultPrice: 30, price: 30, quantity: 0 },

  // Fur & Horns
  { id: 'deer-horn', name: 'GEYİK BOYNUZU', category: 'fur', defaultPrice: 350, price: 350, quantity: 0 },
  { id: 'deer-fur', name: 'GEYİK KÜRKÜ', category: 'fur', defaultPrice: 220, price: 220, quantity: 0 },
  { id: 'cow-hide', name: 'İNEK DERİSİ', category: 'fur', defaultPrice: 310, price: 310, quantity: 0 },
  { id: 'pig-hide', name: 'DOMUZ DERİSİ', category: 'fur', defaultPrice: 130, price: 130, quantity: 0 },
  { id: 'fox-hide', name: 'TİLKİ DERİSİ', category: 'fur', defaultPrice: 145, price: 145, quantity: 0 },
  { id: 'rabbit-hide', name: 'TAVŞAN DERİSİ', category: 'fur', defaultPrice: 15, price: 15, quantity: 0 },

  // Dairy & Fat
  { id: 'cow-milk', name: 'İNEK SÜTÜ', category: 'dairy', defaultPrice: 260, price: 260, quantity: 0 },
  { id: 'pig-fat', name: 'DOMUZ YAĞI', category: 'dairy', defaultPrice: 200, price: 200, quantity: 0 }
];
