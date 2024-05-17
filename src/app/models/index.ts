export interface ProductCategoryEntity {
  id: string;
  name: string;
  profit: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type AppEntities = ProductCategoryEntity;
