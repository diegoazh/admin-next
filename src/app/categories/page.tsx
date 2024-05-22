'use client';

import { Card, Code, Skeleton } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import {
  CreateOrUpdateForm,
  CrudFormInputs,
  IDefineShowCellContentFn,
  OnSubmitCreateOrUpdateFn,
  ShowKeyValueItemTable,
  TableCrud,
} from '../components';
import {
  productCategoriesKey,
  useMutateProductCategory,
  useProductCategories,
} from '../hooks';
import { ProductCategoryEntity } from '../models';
import { RequestMethods } from '../utils';

type ProductCategoryInputs = {
  name: string;
  profit: number;
};

const Products = () => {
  const { data, error, isLoading } = useProductCategories();
  const { t } = useTranslation();
  const { trigger: triggerDelete } = useMutateProductCategory(
    RequestMethods.DELETE
  );
  const { isMutating: isCreating, trigger: triggerCreate } =
    useMutateProductCategory<string>(RequestMethods.POST);
  const { isMutating: isUpdating, trigger: triggerUpdate } =
    useMutateProductCategory<string>(RequestMethods.PATCH);

  const onSubmit: (config: {
    isUpdate: boolean;
  }) => OnSubmitCreateOrUpdateFn<
    ProductCategoryInputs,
    ProductCategoryEntity
  > =
    ({ isUpdate }) =>
    async ({ data, item, isOpen, onClose }) => {
      if (!isUpdate) {
        await triggerCreate({ body: JSON.stringify({ ...data }) });
      } else {
        await triggerUpdate({
          body: JSON.stringify({ ...data, id: item?.id }),
        });
      }

      await mutate(productCategoriesKey);

      if (isOpen) {
        onClose();
      }
    };

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
  const formInputs: CrudFormInputs<
    ProductCategoryInputs,
    ProductCategoryEntity
  > = [
    {
      inputName: 'name',
      defaultValue(item, isUpdate) {
        return isUpdate ? item?.name || '' : '';
      },
      label: t('categories.form.labels.name'),
      inputType: 'text',
      componentType: 'input',
      cssClasses: 'mb-4',
      options: { required: true },
    },
    {
      inputName: 'profit',
      defaultValue(item, isUpdate) {
        return isUpdate ? item?.profit?.toString() || '0' : '';
      },
      label: t('categories.form.labels.profit'),
      inputType: 'number',
      componentType: 'input',
      cssClasses: '',
      options: { required: true },
    },
  ];

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

  return (
    <TableCrud<ProductCategoryEntity>
      isStriped={true}
      modalCreateContent={
        <CreateOrUpdateForm<ProductCategoryInputs, ProductCategoryEntity>
          isMutating={isCreating}
          onFormSubmit={onSubmit({ isUpdate: false })}
          formInputs={formInputs}
        />
      }
      modalDeleteContent={
        <ShowKeyValueItemTable<ProductCategoryEntity>
          tableTitle={t('table.show.title', {
            entityName: t('categories.entityName', { count: 1 }),
          })}
          headerColumns={headerColumns}
          defineCellContent={defineCellContent}
        />
      }
      modalShowContent={
        <ShowKeyValueItemTable<ProductCategoryEntity>
          tableTitle={t('table.show.title', {
            entityName: t('categories.entityName', { count: 1 }),
          })}
          headerColumns={headerColumns}
          defineCellContent={defineCellContent}
        />
      }
      modalUpdateContent={
        <CreateOrUpdateForm
          isUpdate
          isMutating={isUpdating}
          onFormSubmit={onSubmit({ isUpdate: true })}
          formInputs={formInputs}
        />
      }
      entityNameTranslationKey="categories.entityName"
      newItemButtonTooltipText={t('categories.buttons.newItem.tooltip', {
        entityName: t('categories.entityName', { count: 1 }),
      })}
      modalCancelButtonText={t('table.modals.cancelButton')}
      onModalCancelAction={() => console.log('cancel not implemented yet!')}
      modalOkButtonText={t('table.modals.okButton')}
      onModalOkAction={async (modalType, item) => {
        if (modalType === 'delete') {
          await triggerDelete({ body: JSON.stringify({ id: item?.id }) });
          await mutate(productCategoriesKey);
        }
      }}
      columnToFilterOnSearch={'name'}
      tableContent={data}
      tableHeaderColumnsNames={[
        { key: 'name', label: t('categories.table.columns.name') },
        { key: 'profit', label: t('categories.table.columns.profit') },
        { key: 'actions', label: t('table.columns.actions') },
      ]}
      tableEmptyContentText={t('table.emptyContent')}
      tableName={t('categories.table.name')}
    ></TableCrud>
  );
};

export default Products;
