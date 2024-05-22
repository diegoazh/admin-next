'use client';

import { Card, Chip, Code, Skeleton } from '@nextui-org/react';
import capitalize from 'lodash.capitalize';
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
  productsKey,
  useMutateProducts,
  useProductCategories,
  useProducts,
} from '../hooks';
import { ProductEntity } from '../models';
import { RequestMethods } from '../utils';

type ProductInputs = {
  name: string;
  description: string;
  available: boolean;
  productCategoryId: string;
};

const Products = () => {
  const { t } = useTranslation();
  const { data, error, isLoading } = useProducts();
  const { trigger: triggerDelete } = useMutateProducts(RequestMethods.DELETE);
  const { isMutating: isCreating, trigger: triggerCreate } = useMutateProducts(
    RequestMethods.POST
  );
  const { isMutating: isUpdating, trigger: triggerUpdate } = useMutateProducts(
    RequestMethods.PATCH
  );
  const {
    data: categories,
    error: errorCategory,
    isLoading: isLoadingCategory,
  } = useProductCategories();

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

        case t('description').toUpperCase():
          return item?.[key];

        case t('available').toUpperCase():
          return item?.[key] ? (
            <Chip variant="bordered" color="success">
              {t('yes')}
            </Chip>
          ) : (
            <Chip variant="bordered" color="danger">
              {t('no')}
            </Chip>
          );

        case t('productCategory').toUpperCase(): {
          return item[key]?.name;
        }

        default:
          return item?.[key];
      }
    }
  };

  const onSubmit: (config: {
    isUpdate: boolean;
  }) => OnSubmitCreateOrUpdateFn<ProductInputs, ProductEntity> =
    ({ isUpdate }) =>
    async ({ data, item, isOpen, onClose }) => {
      // ! the following line is important because react-hook-forms take the value from the input of the nextui autocomplete and returns the name of the category and we replace it by its id before send it to the api
      data.productCategoryId =
        categories?.find(
          (category) =>
            category.name.toLowerCase() === data.productCategoryId.toLowerCase()
        )?.id || '';

      if (!isUpdate) {
        await triggerCreate({ body: JSON.stringify({ ...data }) });
      } else {
        await triggerUpdate({
          body: JSON.stringify({ ...data, id: item?.id }),
        });
      }

      await mutate(productsKey);

      if (isOpen) {
        onClose();
      }
    };

  const formInputs: CrudFormInputs<ProductInputs, ProductEntity> = [
    {
      inputName: 'name',
      defaultValue(item, isUpdate) {
        return isUpdate && item?.name ? item.name : '';
      },
      label: t('products.form.labels.name'),
      inputType: 'text',
      componentType: 'input',
      cssClasses: 'mb-4',
      options: { required: true },
    },
    {
      inputName: 'available',
      defaultValue(item, isUpdate) {
        return !!(isUpdate && item?.available);
      },
      label: t('products.form.labels.available'),
      inputType: 'checkbox',
      componentType: 'switch',
      cssClasses: 'capitalize mb-4',
      options: { required: true },
    },
    {
      inputName: 'productCategoryId',
      defaultValue(item, isUpdate) {
        return isUpdate && item?.productCategoryId
          ? item.productCategoryId
          : '';
      },
      label: t('products.form.labels.productCategoryId'),
      inputType: 'text',
      componentType: 'autocomplete',
      cssClasses: 'capitalize mb-4',
      options: { required: true },
      collectionItems: categories?.reduce(
        (collection, category) => [
          ...collection,
          { value: category.id, label: capitalize(category.name) },
        ],
        [] as Array<Record<'value' | 'label', string>>
      ),
      defaultInputValue(item) {
        return capitalize(item?.productCategory?.name);
      },
      defaultSelectedKey(item) {
        return item?.productCategoryId;
      },
    },
    {
      inputName: 'description',
      defaultValue(item, isUpdate) {
        return isUpdate && item?.description ? item.description : '';
      },
      label: t('products.form.labels.description'),
      inputType: 'text',
      componentType: 'textarea',
      cssClasses: 'mb-4',
    },
  ];

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

  return (
    <TableCrud<ProductEntity>
      modalCreateContent={
        <CreateOrUpdateForm
          isMutating={isCreating}
          formInputs={formInputs}
          onFormSubmit={onSubmit({ isUpdate: false })}
        />
      }
      modalDeleteContent={
        <ShowKeyValueItemTable<ProductEntity>
          tableTitle={t('table.show.title', {
            entityName: t('products.entityName', { count: 1 }),
          })}
          headerColumns={headerColumns}
          defineCellContent={defineCellContent}
        />
      }
      modalShowContent={
        <ShowKeyValueItemTable<ProductEntity>
          tableTitle={t('table.show.title', {
            entityName: t('products.entityName', { count: 1 }),
          })}
          headerColumns={headerColumns}
          defineCellContent={defineCellContent}
        />
      }
      modalUpdateContent={
        <CreateOrUpdateForm
          isUpdate
          isMutating={isUpdating}
          formInputs={formInputs}
          onFormSubmit={onSubmit({ isUpdate: true })}
        />
      }
      isStriped={true}
      entityNameTranslationKey={'products.entityName'}
      newItemButtonTooltipText={t('products.buttons.newItem.tooltip', {
        entityName: t('products.entityName', { count: 1 }),
      })}
      modalCancelButtonText={t('table.modals.cancelButton')}
      onModalCancelAction={() => console.log('cancel not implemented yet!')}
      modalOkButtonText={t('table.modals.okButton')}
      onModalOkAction={async (modalType, item) => {
        if (modalType === 'delete') {
          await triggerDelete({ body: JSON.stringify({ id: item?.id }) });
          await mutate(productsKey);
        }
      }}
      columnToFilterOnSearch={'name'}
      tableContent={data}
      tableHeaderColumnsNames={[
        {
          key: 'productCategory.name',
          label: t('products.table.columns.category'),
        },
        { key: 'name', label: t('products.table.columns.name') },
        { key: 'available', label: t('products.table.columns.available') },
        { key: 'actions', label: t('products.table.columns.actions') },
      ]}
      tableEmptyContentText={t('table.emptyContent')}
      tableName={t('table.name', {
        entityName: t('products.entityName', { count: 0 }),
      })}
    ></TableCrud>
  );
};

export default Products;
