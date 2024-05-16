'use client';

import { Card, Skeleton } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { ITableCrudProps, TableCrud } from '../../components';
import { useProducts } from '../hooks';

const Products = () => {
  const { data, error, isLoading } = useProducts<
    {
      name: string;
      images?: string;
      description?: string;
      available: boolean;
      productCategoryId: string;
    }[]
  >();
  const { t } = useTranslation();

  const tableCrudProps: ITableCrudProps<any> = {
    modalContent: <div></div>,
    entityName: t('products.entityName'),
    newItemButtonTooltipText: t('products.buttons.newItem.tooltip'),
    modalCancelButtonText: t('products.modals.cancelBtn'),
    onModalCancelAction: () => console.log('cancel works!'),
    modalOkButtonText: t('products.modals.okBtn'),
    onModalOkAction: () => console.log('ok works!'),
    tableColumns: ['productCategoryId', 'name', 'available'],
    tableContent: [
      {
        name: 'test',
        images: '',
        description: '',
        available: false,
        productCategoryId: 'a',
      },
    ],
    tableHeaderColumnsNames: [
      t('products.table.columns.category'),
      t('products.table.columns.name'),
      t('products.table.columns.available'),
    ],
    tableEmptyContentText: t('table.emptyContent'),
    tableName: t('products.table.name'),
    columnActionName: t('table.columns.actions'),
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
