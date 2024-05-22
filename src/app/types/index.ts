import { ProductCategoryEntity, ProductEntity } from '../models';

export type FetcherArrayArgs = [
  input: URL | RequestInfo,
  init?: RequestInit | undefined
];
export type AppEntities = ProductCategoryEntity | ProductEntity;
export type AppEntity<T extends AppEntities> = T extends ProductCategoryEntity
  ? ProductCategoryEntity
  : ProductEntity;
