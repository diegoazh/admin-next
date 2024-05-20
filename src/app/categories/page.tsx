'use client';

import { Card, Code, Skeleton } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import {
  IDefineShowCellContentFn,
  ITableCrudProps,
  ProductCategoryForm,
  ShowKeyValueItemTable,
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

  const headerColumns = [
    { key: 'property', label: t('table.show.columns.property') },
    { key: 'value', label: t('table.show.columns.value') },
  ];
  const defineCellContent: IDefineShowCellContentFn = (key, item) => {
    if (key === 'property') {
      return item?.[key];
    }

    if (key === 'value') {
      switch (item?.['property']) {
        case 'id'.toUpperCase():
          return (
            <Code size="sm" className="text-small text-wrap">
              {item?.[key]}
            </Code>
          );

        case t('createdAt').toUpperCase():
        case t('updatedAt').toUpperCase():
        case t('deletedAt').toUpperCase(): {
          const date = item?.[key];
          return date ? new Date().toLocaleDateString() : '';
        }

        case t('profit').toUpperCase(): {
          return `${item?.[key]} %`;
        }

        default:
          return item?.[key];
      }
    }
  };

  const tableCrudProps: ITableCrudProps<ProductCategoryEntity> = {
    isStriped: true,
    modalCreateContent: <ProductCategoryForm />,
    modalDeleteContent: (
      <ShowKeyValueItemTable<ProductCategoryEntity>
        tableTitle={t('table.show.title', {
          entityName: t('categories.entityName', { count: 1 }),
        })}
        headerColumns={headerColumns}
        defineCellContent={defineCellContent}
      />
    ),
    modalShowContent: (
      <ShowKeyValueItemTable<ProductCategoryEntity>
        tableTitle={t('table.show.title', {
          entityName: t('categories.entityName', { count: 1 }),
        })}
        headerColumns={headerColumns}
        defineCellContent={defineCellContent}
      />
    ),
    modalUpdateContent: <ProductCategoryForm isUpdate />,
    entityNameTranslationKey: 'categories.entityName', // TODO: review this key
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
    columnToFilterOnSearch: 'name',
    tableContent: data,
    tableHeaderColumnsNames: [
      { key: 'name', label: t('categories.table.columns.name') },
      { key: 'profit', label: t('categories.table.columns.profit') },
      { key: 'actions', label: t('table.columns.actions') },
    ],
    tableEmptyContentText: t('table.emptyContent'),
    tableName: t('categories.table.name'),
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
