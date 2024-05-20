'use client';

import { Card, Skeleton } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { ITableCrudProps, TableCrud } from '../../components';
import { useProducts } from '../hooks';
import { ProductEntity } from '../models';

const Products = () => {
  const { data, error, isLoading } = useProducts();
  const { t } = useTranslation();

  const tableCrudProps: ITableCrudProps<ProductEntity> = {
    modalCreateContent: <></>,
    modalDeleteContent: <></>,
    modalShowContent: <></>,
    modalUpdateContent: <></>,
    isStriped: true,
    entityNameTranslationKey: 'products.entityName',
    newItemButtonTooltipText: t('products.buttons.newItem.tooltip', {
      entityName: t('products.entityName', { count: 1 }),
    }),
    modalCancelButtonText: t('table.modals.cancelButton'),
    onModalCancelAction: () => console.log('cancel works!'),
    modalOkButtonText: t('table.modals.okButton'),
    onModalOkAction: () => console.log('ok works!'),
    columnToFilterOnSearch: 'name',
    tableContent: data,
    tableHeaderColumnsNames: [
      { key: 'productCategory.name', label: t('products.table.columns.category') },
      { key: 'name', label: t('products.table.columns.name') },
      { key: 'available', label: t('products.table.columns.available') },
      { key: 'actions', label: t('products.table.columns.actions') },
    ],
    tableEmptyContentText: t('table.emptyContent'),
    tableName: t('table.name', {
      entityName: t('products.entityName', { count: 0 }),
    }),
  };

  if (isLoading) {
    return (
      <>
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
      </>
    );
  }

  return <TableCrud {...tableCrudProps}></TableCrud>;
};

export default Products;
