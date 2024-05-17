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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type AppEntities = ProductCategoryEntity | ProductEntity;
export type AppEntity<T extends ProductCategoryEntity | ProductEntity> =
  T extends ProductCategoryEntity ? ProductCategoryEntity : ProductEntity;
