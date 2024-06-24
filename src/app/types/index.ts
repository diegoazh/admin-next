import { FieldValues } from 'react-hook-form';
import { ICreateOrUpdateFormProps, IShowItemTableProps } from '../components';
import {
  ProductCategoryModel,
  ProductModel,
  SellModel,
  StockModel,
} from '../models';
import { ModalType } from '../utils';

export type FetcherArrayArgs = [
  input: URL | RequestInfo,
  init?: RequestInit | undefined
];

// export type AppEntities =
//   | ProductCategoryEntity
//   | ProductEntity
//   | StockEntity
//   | SellEntity;

// export type AppEntity<T extends AppEntities> = T extends ProductCategoryEntity
//   ? ProductCategoryEntity
//   : T extends ProductEntity
//   ? ProductEntity
//   : T extends StockEntity
//   ? StockEntity
//   : SellEntity;

export type AppModels =
  | ProductCategoryModel
  | ProductModel
  | StockModel
  | SellModel;

export type AppModel<T extends AppModels> = T extends ProductCategoryModel
  ? ProductCategoryModel
  : T extends ProductModel
  ? ProductModel
  : T extends StockModel
  ? StockModel
  : SellModel;

export type OnSubmitCreateOrUpdateFn<T, U extends AppModels> = ({
  data,
  item,
  isOpen,
  onClose,
}: {
  data: T;
  item?: AppModel<U>;
  isOpen: Boolean;
  onClose: () => void;
}) => Promise<void>;

export type OnSubmitCrudFormsFn<
  T extends Record<string, any>,
  U extends AppModels
> = (config: { isUpdate: boolean }) => OnSubmitCreateOrUpdateFn<T, U>;

export type ModalTypeValues = (typeof ModalType)[keyof typeof ModalType];

export type ModalConfigReturnType<
  T extends ModalTypeValues,
  U extends AppModels
> = T extends 'create' | 'update'
  ? ICreateOrUpdateFormProps<FieldValues, U>
  : IShowItemTableProps<U>;
