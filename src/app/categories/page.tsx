'use client';

import { Card, Skeleton } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import {
  ITableCrudProps,
  ProductCategoryForm,
  ProductCategoryShow,
  TableCrud,
} from '../../components';
import {
  RequestMethods,
  productCategoriesKey,
  useMutateProductCategory,
  useProductCategories,
} from '../hooks';
import { ProductCategoryEntity } from '../models';

const Products = () => {
  const { data, error, isLoading } = useProductCategories();
  const { t } = useTranslation();
  const { trigger } = useMutateProductCategory(RequestMethods.DELETE);

  const tableCrudProps: ITableCrudProps<ProductCategoryEntity> = {
    isStriped: true,
    modalCreateContent: <ProductCategoryForm />,
    modalDeleteContent: <ProductCategoryShow />,
    modalShowContent: <ProductCategoryShow />,
    modalUpdateContent: <ProductCategoryForm isUpdate />,
    entityName: 'categories.entityName', // TODO: review this key
    newItemButtonTooltipText: t('categories.buttons.newItem.tooltip', {
      entityName: t('categories.entityName', { count: 1 }),
    }),
    modalCancelButtonText: t('table.modals.cancelButton'),
    onModalCancelAction: () => console.log('cancel works!'),
    modalOkButtonText: t('table.modals.okButton'),
    onModalOkAction: async (modalType, item) => {
      if (modalType === 'delete') {
        await trigger({ body: JSON.stringify({ id: item?.id }) });
        await mutate(productCategoriesKey);
      }
    },
    tableColumns: ['name', 'profit'],
    tableContent: data,
    tableHeaderColumnsNames: [
      t('categories.table.columns.name'),
      t('categories.table.columns.profit'),
    ],
    tableEmptyContentText: t('table.emptyContent'),
    tableName: t('categories.table.name'),
    columnActionName: t('table.columns.actions'),
  };

  if (isLoading) {
    return (
      <div className="w-full h-4/5 rounded-md">
        <Card className="w-5/4 space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-8 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            {[...Array(5)].map((value, index) => (
              <Skeleton className="rounded-lg" key={index}>
                <div className="h-3 rounded-lg bg-default-200"></div>
              </Skeleton>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return <TableCrud {...tableCrudProps}></TableCrud>;
};

export default Products;
