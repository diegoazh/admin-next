import { DineroOptions } from 'dinero.js';
import { PaymentMode, StockType } from './constants';

interface BaseAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ProductCategoryEntity extends BaseAttributes {
  name: string;
  profit: number;
}

export interface ProductEntity extends BaseAttributes {
  name: string;
  images?: string;
  description?: string;
  available: boolean;
  productCategory: ProductCategoryEntity;
}

export interface StockEntity extends BaseAttributes {
  product: ProductEntity;
  price: DineroOptions<number>;
  quantity: number;
  type: (typeof StockType)[keyof typeof StockType];
  priceHistory: DineroOptions<number>[];
}

export interface SellEntity extends BaseAttributes {
  date: Date | string;
  product: ProductEntity;
  mode: (typeof PaymentMode)[keyof typeof PaymentMode];
  quantity: number;
  price: DineroOptions<number>;
  cost: DineroOptions<number>;
}
