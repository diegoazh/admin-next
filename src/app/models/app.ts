import { Dinero } from 'dinero.js';
import {
  ProductCategoryEntity,
  ProductEntity,
  SellEntity,
  StockEntity,
} from './api';

export interface ProductCategoryModel extends ProductCategoryEntity {}

export interface ProductModel extends ProductEntity {}

export interface StockModel extends StockEntity {
  dCostPrice: Dinero<number>;
  parsedMoney: {
    cost: string;
    txtCost: string;
    fPrice: string;
    txtFPrice: string;
  };
  typeIcon: JSX.Element;
}

export interface SellModel extends SellEntity {
  txtDate: string;
  modeNode: React.ReactNode;
  dCost: Dinero<number>;
  dPrice: Dinero<number>;
  dTotal: Dinero<number>;
  dTotalCost: Dinero<number>;
  dRevenue: Dinero<number>;
  parsedMoney: {
    cost: string;
    txtCost: string;
    price: string;
    txtPrice: string;
    total: string;
    txtTotal: string;
    totalCost: string;
    txtTotalCost: string;
    revenue: string;
    txtRevenue: string;
  };
}
