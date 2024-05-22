export interface ProductCategoryEntity {
  id: string;
  name: string;
  profit: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ProductEntity {
  id: string;
  name: string;
  images?: string;
  description?: string;
  available: boolean;
  productCategoryId: string;
  productCategory?: ProductCategoryEntity;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
