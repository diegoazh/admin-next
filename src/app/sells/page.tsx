'use client';

import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CheckIcon,
  CreditCardIcon,
  QrCodeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CreditCardIcon as CreditCardIconSolid } from '@heroicons/react/24/solid';
import { Code, SortDescriptor, Tooltip } from '@nextui-org/react';
import { dinero, multiply, subtract } from 'dinero.js';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import {
  DefineShowCellContentFn,
  KeyValueBuilderFn,
  ShowKeyValueItem,
  TableCrud,
  TableLoadingSkeleton,
} from '../components';
import { useMutateSells, useSells, useStocks } from '../hooks';
import { SellModel } from '../models';
import { SellEntity } from '../models/api';
import { PaymentMode } from '../models/constants';
import { AppModels, ModalConfigReturnType } from '../types';
import {
  ModalType,
  RequestMethods,
  flatObject,
  moneyParser,
  upperFirst,
} from '../utils';

const Sells = () => {
  const { t } = useTranslation();
  const sellsKey = useRef<string>(''); // TODO: maybe should be a useRef
  const [isLoading, setIsLoading] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'txtDate',
    direction: 'descending',
  });
  const {
    key: sellsKeyAsc,
    swr: { data: dataAsc = [], isLoading: isSellsLoadingAsc },
  } = useSells('order[0]=date&order[0]=ASC');
  const {
    key: sellsKeyDesc,
    swr: { data: dataDesc = [], isLoading: isSellsLoadingDesc },
  } = useSells('order[0]=date&order[0]=DESC');
  const {
    swr: { data: stocks, isLoading: isStockLoading },
  } = useStocks();
  const {
    swr: { isMutating: isSellCreating, trigger: triggerCreate },
  } = useMutateSells(RequestMethods.POST);
  const {
    swr: { isMutating: isSellUpdating, trigger: triggerUpdate },
  } = useMutateSells(RequestMethods.PATCH);
  const {
    swr: { trigger: triggerDelete },
  } = useMutateSells(RequestMethods.DELETE);

  sellsKey.current = sellsKeyDesc;

  const modeIconParser = useCallback(
    (mode: (typeof PaymentMode)[keyof typeof PaymentMode]) => {
      return (
        <Tooltip content={upperFirst(t(mode))} placement="right">
          {mode === PaymentMode.CASH ? (
            <BanknotesIcon className="w-6" />
          ) : mode === PaymentMode.MP_QR ? (
            <QrCodeIcon className="w-6" />
          ) : mode === PaymentMode.MP_CREDIT ? (
            <CreditCardIcon className="w-6" />
          ) : mode === PaymentMode.MP_DEBIT ? (
            <CreditCardIconSolid className="w-6" />
          ) : (
            <BuildingLibraryIcon className="w-6" />
          )}
        </Tooltip>
      );
    },
    [t]
  );
  const sellDataParser = useCallback(
    (value: SellEntity) => {
      const dCost = dinero(value.cost);
      const dPrice = dinero(value.price);
      const dTotal = multiply(dPrice, value.quantity);
      const dTotalCost = multiply(dCost, value.quantity);
      const dRevenue = subtract(dTotal, dTotalCost);
      const { txt: txtPrice, num: price } = moneyParser(dPrice);
      const { txt: txtCost, num: cost } = moneyParser(dCost);
      const { txt: txtTotal, num: total } = moneyParser(dTotal);
      const { txt: txtTotalCost, num: totalCost } = moneyParser(dTotalCost);
      const { txt: txtRevenue, num: revenue } = moneyParser(dRevenue);
      const modeNode = modeIconParser(value.mode);
      const date = new Date(value.date);

      return {
        ...value,
        date,
        txtDate: date.toLocaleDateString('es-AR'),
        modeNode,
        dCost,
        dPrice,
        dTotal,
        dTotalCost,
        dRevenue,
        parsedMoney: {
          cost,
          txtCost,
          price,
          txtPrice,
          total,
          txtTotal,
          totalCost,
          txtTotalCost,
          revenue,
          txtRevenue,
        },
      };
    },
    [modeIconParser]
  );

  const sells = useMemo(() => {
    if (sortDescriptor.direction === 'descending') {
      sellsKey.current = sellsKeyDesc;
      return dataDesc.map(sellDataParser);
    }

    sellsKey.current = sellsKeyAsc;
    return dataAsc.map(sellDataParser);
  }, [
    sortDescriptor,
    sellsKey,
    sellsKeyAsc,
    sellsKeyDesc,
    dataAsc,
    dataDesc,
    sellDataParser,
  ]);

  const keyValueBuilder = useCallback<KeyValueBuilderFn<AppModels>>(
    (item) => {
      if (item) {
        const flattened = flatObject(item, [
          'date',
          'mode',
          'createdAt',
          'updatedAt',
          'price',
          'cost',
          'dCost',
          'dPrice',
          'dTotal',
          'dTotalCost',
          'dRevenue',
          'parsedMoney.cost',
          'parsedMoney.price',
          'parsedMoney.total',
          'parsedMoney.totalCost',
          'parsedMoney.revenue',
          'product.id',
          'product.description',
          'product.status',
          'product.images',
          'product.size',
          'product.createdAt',
          'product.updatedAt',
          'product.deletedAt',
          'product.productCategory.id',
          'product.productCategory.profit',
          'product.productCategory.createdAt',
          'product.productCategory.updatedAt',
          'product.productCategory.deletedAt',
        ]);

        return Object.entries(flattened).map(
          ([key, value]) => ({
            key: `property-${key.toString()}`,
            property: t(key.toString(), key.toString()),
            value,
          }),
          [] as ShowKeyValueItem[]
        );
      }

      return [];
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

          case t('txtDate'):
            return item[key];

          case t('product.name'):
            return item[key];

          case t('product.available'):
            return item[key] ? (
              <CheckIcon className="w-6" />
            ) : (
              <XMarkIcon className="w-6" />
            );

          case t('modeNode'):
            return item[key];

          case t('quantity'):
            return item[key];

          case t('parsedMoney.price'):
          case t('parsedMoney.txtPrice'):
            return item[key];

          case t('parsedMoney.cost'):
          case t('parsedMoney.txtCost'):
            return item[key];

          case t('parsedMoney.total'):
          case t('parsedMoney.txtTotal'):
            return item[key];

          case t('parsedMoney.totalCost'):
          case t('parsedMoney.txtTotalCost'):
            return item[key];

          case t('parsedMoney.revenue'):
          case t('parsedMoney.txtRevenue'):
            return item[key];

          default:
            return item[key] as JSX.Element;
        }
      }
    },
    [t]
  );

  if (isSellsLoadingDesc || isSellsLoadingAsc) {
    return <TableLoadingSkeleton />;
  }

  return (
    <TableCrud<SellModel>
      isStriped
      isLoading={isLoading}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      itemKeyForModalTitle="txtDate"
      columnOrKeyToFilterOnSearch="date"
      entityNameTranslationKey="sells.entityName"
      itemsToRender={sells}
      tableEmptyContentText={t('table.emptyContent')}
      tableHeaderColumnsNames={[
        {
          key: 'txtDate',
          label: t('sells.table.columns.date'),
          allowsSorting: true,
        },
        { key: 'product.name', label: t('sells.table.columns.product') },
        { key: 'modeNode', label: t('sells.table.columns.mode') },
        { key: 'quantity', label: t('sells.table.columns.quantity') },
        { key: 'parsedMoney.txtPrice', label: t('sells.table.columns.price') },
        { key: 'parsedMoney.txtCost', label: t('sells.table.columns.cost') },
        { key: 'parsedMoney.txtTotal', label: t('sells.table.columns.total') },
        {
          key: 'parsedMoney.txtTotalCost',
          label: t('sells.table.columns.totalCost'),
        },
        {
          key: 'parsedMoney.txtRevenue',
          label: t('sells.table.columns.revenue'),
        },
        {
          key: 'actions',
          label: t('table.columns.actions'),
        },
      ]}
      modalContentConfig={(modalType) => {
        switch (modalType) {
          case ModalType.CREATE:
          case ModalType.UPDATE:
            return {
              isUpdate: modalType === ModalType.UPDATE,
              isMutating:
                modalType === ModalType.UPDATE
                  ? isSellUpdating
                  : isSellCreating,
              formInputs: null,
              onFormSubmit: null,
            } as any;

          default:
            return {
              keyValueBuilder: keyValueBuilder,
              defineCellContent: defineCellContentOfShowModal,
              tableTitle: t('table.show.title', {
                entityName: t('sells.entityName', { count: 1 }),
              }),
            } as ModalConfigReturnType<typeof ModalType.SHOW, SellModel>;
        }
      }}
      modalCancelButtonText={t('no')}
      modalOkButtonText={t('yes')}
      newItemButtonTooltipText={t('table.buttons.newItem.tooltip', {
        entityName: t('sells.entityName', { count: 1 }),
      })}
      onModalCancelAction={() =>
        console.info('cancel action not implemented yet!')
      }
      onModalOkAction={async (modalType, item) => {
        if (modalType === 'delete') {
          await triggerDelete({ body: JSON.stringify({ id: item?.id }) });
          await mutate(sellsKey.current);
        }
      }}
      columnClassNames={{
        quantity: 'text-right',
        'parsedMoney.txtPrice': 'text-right',
        'parsedMoney.txtCost': 'text-right',
        'parsedMoney.txtTotal': 'text-right',
        'parsedMoney.txtTotalCost': 'text-right',
        'parsedMoney.txtRevenue': 'text-right',
      }}
    />
  );
};

export default Sells;
