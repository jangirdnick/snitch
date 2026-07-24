export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductColor {
  name: string;
  isDefault: boolean;
  images: { url: string; isPrimary: boolean }[];
}

export interface InventoryProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  category: Category | string;
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  price: {
    amount: number;
    currency: string;
  };
  lowStockThreshold: number;
  colors?: ProductColor[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
