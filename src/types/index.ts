export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'WarehouseManager' | 'SalesCashier';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: Category | null;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}
