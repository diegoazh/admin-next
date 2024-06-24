'use client';

import { Code } from '@nextui-org/react';
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
import { useMutateProductCategory, useProductCategories } from '../hooks';
import { ProductCategoryModel } from '../models';
import { ProductCategoryEntity } from '../models/api';
import {
  AppModels,
  ModalConfigReturnType,
  OnSubmitCrudFormsFn,
} from '../types';
import { ModalType, RequestMethods } from '../utils';

type ProductCategoryInputs = {
  name: string;
  profit: number;
};

const Products = () => {
  const {
    key: categoryKey,
    swr: { data, error, isLoading },
  } = useProductCategories();
  const { t } = useTranslation();
  const {
    swr: { trigger: triggerDelete },
  } = useMutateProductCategory(RequestMethods.DELETE);
  const {
    swr: { isMutating: isCreating, trigger: triggerCreate },
  } = useMutateProductCategory<string>(RequestMethods.POST);
  const {
    swr: { isMutating: isUpdating, trigger: triggerUpdate },
  } = useMutateProductCategory<string>(RequestMethods.PATCH);

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

  const onSubmit = useCallback<
    OnSubmitCrudFormsFn<ProductCategoryInputs, ProductCategoryEntity>
  >(
    ({ isUpdate }) =>
      async ({ data, item, isOpen, onClose }) => {
        if (!isUpdate) {
          await triggerCreate({ body: JSON.stringify({ ...data }) });
        } else {
          await triggerUpdate({
            body: JSON.stringify({ ...data, id: item?.id }),
          });
        }

        await mutate(categoryKey);

        if (isOpen) {
          onClose();
        }
      },
    [categoryKey, triggerCreate, triggerUpdate]
  );

  const defineCellContent = useCallback<DefineShowCellContentFn>(
    (key, item) => {
      if (key === 'property') {
        return t(item[key]);
      }

      if (key === 'value') {
        switch (item['property']) {
          case t('id'):
            return (
              <Code size="sm" className="text-small text-wrap">
                {item[key]?.toString()}
              </Code>
            );

          case t('createdAt'):
          case t('updatedAt'):
          case t('deletedAt'): {
            const date = item[key];
            return date ? new Date().toLocaleDateString() : '';
          }

          case t('profit'): {
            return `${item[key]} %`;
          }

          default:
            return item[key] as JSX.Element;
        }
      }
    },
    [t]
  );
  const formInputs = useMemo<
    CrudFormInputs<ProductCategoryInputs, ProductCategoryEntity>
  >(
    () => [
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
    ],
    [t]
  );

  if (isLoading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <TableCrud<ProductCategoryModel>
      isStriped={true}
      modalContentConfig={(modalType) => {
        switch (modalType) {
          case ModalType.CREATE:
          case ModalType.UPDATE:
            return {
              isUpdate: modalType === ModalType.UPDATE,
              isMutating:
                modalType === ModalType.UPDATE ? isUpdating : isCreating,
              onFormSubmit: onSubmit({
                isUpdate: modalType === ModalType.UPDATE,
              }),
              formInputs: formInputs,
            } as ModalConfigReturnType<
              typeof ModalType.CREATE,
              ProductCategoryModel
            >;

          default:
            return {
              tableTitle: t('table.show.title', {
                entityName: t('categories.entityName', { count: 1 }),
              }),
              defineCellContent: defineCellContent,
              keyValueBuilder: keyValueBuilder,
            } as ModalConfigReturnType<typeof ModalType.SHOW, ProductCategoryModel>;
        }
      }}
      entityNameTranslationKey="categories.entityName"
      newItemButtonTooltipText={t('table.buttons.newItem.tooltip', {
        entityName: t('categories.entityName', { count: 1 }),
      })}
      modalCancelButtonText={t('table.modals.cancelButton')}
      onModalCancelAction={() => console.log('cancel not implemented yet!')}
      modalOkButtonText={t('table.modals.okButton')}
      onModalOkAction={async (modalType, item) => {
        if (modalType === 'delete') {
          await triggerDelete({ body: JSON.stringify({ id: item?.id }) });
          await mutate(categoryKey);
        }
      }}
      columnOrKeyToFilterOnSearch={'name'}
      itemsToRender={data}
      tableHeaderColumnsNames={[
        { key: 'name', label: t('categories.table.columns.name') },
        { key: 'profit', label: t('categories.table.columns.profit') },
        { key: 'actions', label: t('table.columns.actions') },
      ]}
      tableEmptyContentText={t('table.emptyContent')}
    ></TableCrud>
  );
};

export default Products;
