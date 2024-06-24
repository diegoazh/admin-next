'use client';

import { ARS } from '@dinero.js/currencies';
import {
  BuildingStorefrontIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { Chip, Code, Tooltip } from '@nextui-org/react';
import { add, allocate, dinero, multiply, toSnapshot } from 'dinero.js';
import capitalize from 'lodash.capitalize';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import {
  CrudFormInputs,
  DefineShowCellContentFn,
  KeyValueBuilderFn,
  ShowKeyValueItem,
  TableCrud,
  TableLoadingSkeleton,
} from '../components';
import { useMutateStocks, useProducts, useStocks } from '../hooks';
import { StockModel } from '../models';
import { StockType } from '../models/constants';
import {
  AppModels,
  ModalConfigReturnType,
  OnSubmitCrudFormsFn,
} from '../types';
import {
  ModalType,
  RequestMethods,
  buildAutocompleteCollectionItems,
  moneyParser,
} from '../utils';

interface StockInputs {
  productCategoryId: string;
  productId: string;
  price: any;
  quantity: number;
  type?: (typeof StockType)[keyof typeof StockType];
  fPrice: string;
}

interface StockCreateInputs extends StockInputs {
  taxes: boolean;
}

const Stocks = () => {
  const { t } = useTranslation();
  const {
    key: stocksKey,
    swr: { data, isLoading: isStockLoading },
  } = useStocks();
  const {
    swr: { data: products, isLoading: isProductLoading },
  } = useProducts();
  const {
    swr: { isMutating: isStockCreating, trigger: triggerCreate },
  } = useMutateStocks(RequestMethods.POST);
  const {
    swr: { isMutating: isStockUpdating, trigger: triggerUpdate },
  } = useMutateStocks(RequestMethods.PATCH);
  const {
    swr: { trigger: triggerDelete },
  } = useMutateStocks(RequestMethods.DELETE);

  const stocks = useMemo<StockModel[]>(
    () =>
      (data || []).map((value) => {
        const dCostPrice = dinero(value.price);
        const { txt: txtCost, num: cost } = moneyParser(dCostPrice);
        const ratios = [
          value.product.productCategory?.profit || 0,
          100 - (value.product.productCategory?.profit || 100),
        ];
        const [p1, p2] = allocate(dCostPrice, ratios);
        const { num: fPrice, txt: txtFPrice } = moneyParser(
          add(dCostPrice, p1)
        );

        return {
          ...value,
          dCostPrice,
          parsedMoney: {
            cost,
            txtCost,
            fPrice,
            txtFPrice,
          },
          typeIcon:
            value.type === 'ONSITE' ? (
              <Chip variant="light" color="primary">
                <Tooltip content={value.type} placement="left">
                  <BuildingStorefrontIcon className="w-6" />
                </Tooltip>
              </Chip>
            ) : (
              <Chip variant="light" color="secondary">
                <Tooltip content={value.type} placement="left">
                  <ComputerDesktopIcon className="w-6" />
                </Tooltip>
              </Chip>
            ),
        };
      }),
    [data]
  );

  const formInput = useMemo<CrudFormInputs<StockInputs, StockModel>>(
    () => [
      {
        inputName: 'productId',
        label: t('stocks.form.labels.productId'),
        inputType: 'text',
        componentType: 'autocomplete',
        cssClasses: 'capitalize mb-4',
        options: { required: true },
        collectionItems: buildAutocompleteCollectionItems(products),
        defaultValue(item, isUpdate) {
          return isUpdate && item?.product.id ? item.product.id : '';
        },
        defaultInputValue(item, isUpdate) {
          return capitalize(
            isUpdate && item?.product.id ? item?.product?.name : ''
          );
        },
        defaultSelectedKey(item, isUpdate) {
          return isUpdate && item?.product.id ? item?.product?.name : '';
        },
      },
      {
        inputName: 'quantity',
        defaultValue(item, isUpdate) {
          return isUpdate ? item?.quantity?.toString() || '0' : '';
        },
        label: t('stocks.form.labels.quantity'),
        inputType: 'number',
        step: '1',
        min: '0',
        max: '100000',
        componentType: 'input',
        cssClasses: 'mb-4',
        options: { required: true },
      },
      {
        inputName: 'fPrice',
        defaultValue(item, isUpdate) {
          return isUpdate ? (item as StockModel)?.parsedMoney.cost || '0' : '';
        },
        label: t('stocks.form.labels.price'),
        inputType: 'number',
        step: '0.01',
        componentType: 'input',
        cssClasses: 'mb-4',
        options: { required: true },
      },
      {
        inputName: 'type',
        defaultValue(item, isUpdate) {
          return !!isUpdate && !!item && item?.type === 'ONLINE';
        },
        label: (
          <Chip variant="light" color="default">
            <Tooltip
              content={t('stocks.form.labels.onLine')}
              placement="right"
              className="capitalize"
              showArrow
            >
              <ComputerDesktopIcon className="w-6" />
            </Tooltip>
          </Chip>
        ),
        inputType: 'checkbox',
        componentType: 'switch',
        cssClasses: 'capitalize',
        options: { required: false },
      },
    ],
    [products, t]
  );
  const formInputCreate = useMemo<
    CrudFormInputs<StockCreateInputs, StockModel>
  >(
    () => [
      {
        inputName: 'taxes',
        defaultValue() {
          return false;
        },
        label: t('stocks.form.labels.taxes'),
        inputType: 'checkbox',
        componentType: 'switch',
        cssClasses: 'capitalize mb-4',
        options: { required: false },
      },
      ...formInput,
    ],
    [formInput, t]
  );
  const keyValueBuilder = useCallback<KeyValueBuilderFn<AppModels>>(
    (item) => {
      return !item
        ? []
        : (Object.keys(item) as (keyof StockModel)[])
            .map((key) => {
              if (
                key === 'dCostPrice' ||
                key === 'parsedMoney' ||
                key === 'priceHistory' ||
                key === 'typeIcon'
              ) {
                return undefined;
              }

              return {
                key: `property-${key.toString()}`,
                property: t(key.toString(), key.toString()),
                value:
                  key === 'price'
                    ? (item as StockModel).parsedMoney.txtFPrice
                    : key === 'type'
                    ? (item as StockModel).typeIcon
                    : (item as any)[key],
              };
            })
            .filter((value): value is ShowKeyValueItem => !!value)
            .sort((a, b) => {
              if (a.property === t('id')) return -1;

              if (a.property === t('product') && b.property !== t('id'))
                return -1;

              return 0;
            });
    },
    [t]
  );

  const defineCellContentOfShowModal = useCallback<DefineShowCellContentFn>(
    (key, item) => {
      if (key === 'property') {
        return t(item[key]);
      }

      if (key === 'value') {
        switch (item['property']) {
          case t('id'):
            return (
              <Code size="sm" className="text-small text-wrap">
                {item[key] as string}
              </Code>
            );

          case t('createdAt'):
          case t('updatedAt'):
          case t('deletedAt'): {
            const date = item?.[key];
            return date ? new Date().toLocaleDateString() : '';
          }

          case t('productCategory'): {
            return (item[key] as Record<string, any>)?.name;
          }

          case t('product'): {
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
    OnSubmitCrudFormsFn<StockInputs | StockCreateInputs, StockModel>
  >(
    ({ isUpdate }) =>
      async ({ data, isOpen, onClose, item }) => {
        data.productId =
          products?.find(
            (product) =>
              product.name.toLowerCase() === data.productId.toLowerCase()
          )?.id || '';
        data.type =
          data.type == null
            ? item?.type
            : !!data.type
            ? StockType.ONLINE
            : StockType.ONSITE;
        const price = dinero({
          amount: Number(data.fPrice.replace('.', '')),
          currency: ARS,
        });
        data.price = toSnapshot(price);
        data.quantity = Number(data.quantity);

        if (isUpdate) {
          await triggerUpdate({
            body: JSON.stringify({ ...data, id: item?.id }),
          });
        } else {
          if ((data as StockCreateInputs).taxes) {
            const priceWithTaxes = multiply(price, 1.21);
            data.price = toSnapshot(priceWithTaxes);
          }

          await triggerCreate({ body: JSON.stringify({ ...data }) });
        }

        await mutate(stocksKey);

        if (isOpen) {
          onClose();
        }
      },
    [products, stocksKey, triggerCreate, triggerUpdate]
  );

  if (isStockLoading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <TableCrud<StockModel>
      isStriped
      itemKeyForModalTitle="product.name"
      columnOrKeyToFilterOnSearch="product.name"
      entityNameTranslationKey="stocks.entityName"
      itemsToRender={stocks}
      tableEmptyContentText={t('table.emptyContent')}
      tableHeaderColumnsNames={[
        {
          key: 'typeIcon',
          label: t('stocks.table.columns.type'),
        },
        {
          key: 'product.productCategory.name',
          label: t('stocks.table.columns.category'),
        },
        { key: 'product.name', label: t('stocks.table.columns.product') },
        {
          key: 'quantity',
          label: t('stocks.table.columns.quantity'),
          classNames: 'text-right',
        },
        {
          key: 'parsedMoney.txtCost',
          label: t('stocks.table.columns.price'),
          classNames: 'text-right',
        },
        {
          key: 'parsedMoney.txtFPrice',
          label: t('stocks.table.columns.finalPrice'),
          classNames: 'text-right',
        },
        { key: 'actions', label: t('table.columns.actions') },
      ]}
      modalContentConfig={(modalType) => {
        switch (modalType) {
          case ModalType.CREATE:
          case ModalType.UPDATE:
            return {
              isUpdate: modalType === ModalType.UPDATE,
              isMutating:
                modalType === ModalType.UPDATE
                  ? isStockUpdating
                  : isStockCreating,
              formInputs:
                modalType === ModalType.UPDATE ? formInput : formInputCreate,
              onFormSubmit: onSubmit({
                isUpdate: modalType === ModalType.UPDATE,
              }),
            } as ModalConfigReturnType<typeof ModalType.CREATE, StockModel>;

          default:
            return {
              defineCellContent: defineCellContentOfShowModal,
              tableTitle: t('table.show.title', {
                entityName: t('stocks.entityName', { count: 1 }),
              }),
              keyValueBuilder: keyValueBuilder,
            } as ModalConfigReturnType<typeof ModalType.SHOW, StockModel>;
        }
      }}
      modalCancelButtonText={t('no')}
      modalOkButtonText={t('yes')}
      newItemButtonTooltipText={t('table.buttons.newItem.tooltip', {
        entityName: t('stocks.entityName', { count: 1 }),
      })}
      onModalCancelAction={() =>
        console.info('cancel action not implemented yet!')
      }
      onModalOkAction={async (modalType, item) => {
        if (modalType === ModalType.DELETE) {
          await triggerDelete({ body: JSON.stringify({ id: item?.id }) });
          await mutate(stocksKey);
        }
      }}
      columnClassNames={{
        'parsedMoney.txtFPrice': 'text-right',
        quantity: 'text-right',
        'parsedMoney.txtCost': 'text-right',
      }}
    ></TableCrud>
  );
};

export default Stocks;
