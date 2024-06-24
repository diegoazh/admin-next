'use client';

import { Chip, Code } from '@nextui-org/react';
import capitalize from 'lodash.capitalize';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import {
  CrudFormInputs,
  DefineShowCellContentFn,
  KeyValueBuilderFn,
  TableCrud,
  TableLoadingSkeleton,
} from '../components';
import { useMutateProducts, useProductCategories, useProducts } from '../hooks';
import { ProductModel } from '../models';
import { ProductEntity } from '../models/api';
import {
  AppModels,
  ModalConfigReturnType,
  OnSubmitCrudFormsFn,
} from '../types';
import { ModalType, RequestMethods } from '../utils';

type ProductInputs = {
  name: string;
  description: string;
  available: boolean;
  productCategoryId: string;
};

const Products = () => {
  const { t } = useTranslation();
  const {
    key: productsKey,
    swr: { data, error, isLoading },
  } = useProducts();
  const {
    swr: { trigger: triggerDelete },
  } = useMutateProducts(RequestMethods.DELETE);
  const {
    swr: { isMutating: isCreating, trigger: triggerCreate },
  } = useMutateProducts(RequestMethods.POST);
  const {
    swr: { isMutating: isUpdating, trigger: triggerUpdate },
  } = useMutateProducts(RequestMethods.PATCH);
  const {
    swr: {
      data: categories,
      error: errorCategory,
      isLoading: isLoadingCategory,
    },
  } = useProductCategories();

  const keyValueBuilder = useCallback<KeyValueBuilderFn<AppModels>>(
    (item) => {
      return !item
        ? []
        : (Object.keys(item) as (keyof AppModels)[]).map((key) => {
            return {
              key: `property-${key.toString()}`,
              property: t(key.toString(), key.toString()),
              value: item[key],
            };
          });
    },
    [t]
  );

  const defineCellContent = useCallback<DefineShowCellContentFn>(
    (key, item) => {
      if (key === 'property') {
        return t(item[key]);
      }

      if (key === 'value') {
        switch (item['property'].toUpperCase()) {
          case t('id').toUpperCase():
            return (
              <Code size="sm" className="text-small text-wrap">
                {item[key]?.toString()}
              </Code>
            );

          case t('createdAt').toUpperCase():
          case t('updatedAt').toUpperCase():
          case t('deletedAt').toUpperCase(): {
            const date = item[key];
            return date ? new Date().toLocaleDateString() : '';
          }

          case t('description').toUpperCase():
            return item[key];

          case t('available').toUpperCase():
            return item[key] ? (
              <Chip variant="bordered" color="success">
                {t('yes')}
              </Chip>
            ) : (
              <Chip variant="bordered" color="danger">
                {t('no')}
              </Chip>
            );

          case t('productCategory').toUpperCase(): {
            return (item[key] as Record<string, any>)?.name;
          }

          default:
            return item[key] as JSX.Element;
        }
      }
    },
    [t]
  );

  const onSubmit = useCallback<
    OnSubmitCrudFormsFn<ProductInputs, ProductEntity>
  >(
    ({ isUpdate }) =>
      async ({ data, item, isOpen, onClose }) => {
        // ! the following line is important because react-hook-forms take the value from the input of the nextui autocomplete and returns the name of the category and we replace it by its id before send it to the api
        data.productCategoryId =
          categories?.find(
            (category) =>
              category.name.toLowerCase() ===
              data.productCategoryId.toLowerCase()
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
      },
    [categories, productsKey, triggerCreate, triggerUpdate]
  );

  const formInputs = useMemo<CrudFormInputs<ProductInputs, ProductModel>>(
    () => [
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
          return isUpdate && item?.productCategory.id
            ? item.productCategory.id
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
          return item?.productCategory.id;
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
    ],
    [categories, t]
  );

  if (isLoading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <TableCrud<ProductModel>
      modalContentConfig={(modalType) => {
        switch (modalType) {
          case ModalType.CREATE:
          case ModalType.UPDATE:
            return {
              isUpdate: modalType === ModalType.UPDATE,
              isMutating:
                modalType === ModalType.UPDATE ? isUpdating : isCreating,
              formInputs: formInputs,
              onFormSubmit: onSubmit({
                isUpdate: modalType === ModalType.UPDATE,
              }),
            } as ModalConfigReturnType<typeof ModalType.CREATE, ProductModel>;

          default:
            return {
              tableTitle: t('table.show.title', {
                entityName: t('products.entityName', { count: 1 }),
              }),
              defineCellContent: defineCellContent,
              keyValueBuilder: keyValueBuilder,
            } as ModalConfigReturnType<typeof ModalType.SHOW, ProductModel>;
        }
      }}
      isStriped={true}
      entityNameTranslationKey={'products.entityName'}
      newItemButtonTooltipText={t('table.buttons.newItem.tooltip', {
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
      columnOrKeyToFilterOnSearch={'name'}
      itemsToRender={data}
      tableHeaderColumnsNames={[
        {
          key: 'productCategory.name',
          label: t('products.table.columns.category'),
        },
        { key: 'name', label: t('products.table.columns.name') },
        { key: 'available', label: t('products.table.columns.available') },
        { key: 'actions', label: t('table.columns.actions') },
      ]}
      tableEmptyContentText={t('table.emptyContent')}
    ></TableCrud>
  );
};

export default Products;
