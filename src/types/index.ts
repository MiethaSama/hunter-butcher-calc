export interface Product {
  id: string;
  name: string;
  category: 'meat' | 'fur' | 'dairy';
  defaultPrice: number;
  price: number;
  quantity: number;
}

export interface Category {
  id: 'meat' | 'fur' | 'dairy';
  title: string;
  icon: string;
}

export interface DetectedPrice {
  name: string;
  price: number;
}
