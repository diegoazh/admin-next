import {
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AppModel,
  AppModels,
  ModalConfigReturnType,
  ModalTypeValues,
} from '../types';
import {
  ModalType,
  getValueOfTheKey,
  renderCellContent,
  upperFirst,
} from '../utils';
import {
  CreateOrUpdateForm,
  ICreateOrUpdateFormProps,
} from './CreateOrUpdateForm';
import { ModalCrud } from './ModalCrud';
import { IShowItemTableProps, ShowKeyValueTable } from './ShowKeyValueTable';
import { TableCrudBottomContent } from './TableCrudBottomContent';
import { TableCrudTopContent } from './TableCrudTopContent';

export interface ITableCrudProps<T extends AppModels, U = AppModel<T>> {
  isStriped?: boolean;
  isLoading?: boolean;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => any;
  entityNameTranslationKey: string;
  newItemButtonTooltipText: string;
  tableHeaderColumnsNames: {
    key: string;
    label: string;
    classNames?: string;
    allowsSorting?: boolean;
  }[];
  columnOrKeyToFilterOnSearch: keyof U | string;
  tableEmptyContentText: string;
  itemsToRender?: U[];
  modalContentConfig: <U extends ModalTypeValues>(
    modalType: U
  ) => ICreateOrUpdateFormProps<FieldValues, T> | IShowItemTableProps<T>;
  modalCancelButtonText: string;
  onModalCancelAction: () => void;
  modalOkButtonText: string;
  onModalOkAction: (
    modalType?: ModalTypeValues,
    item?: U
  ) => void | Promise<void>;
  columnClassNames?: Record<string, string>;
  itemKeyForModalTitle?: string;
}

// TODO: add filters to the table but receiving function that changes the itemsToRender received from outside of the component
export function TableCrud<T extends AppModels>({
  isStriped = false,
  isLoading = false,
  sortDescriptor,
  onSortChange,
  entityNameTranslationKey,
  newItemButtonTooltipText,
  tableHeaderColumnsNames,
  columnOrKeyToFilterOnSearch,
  tableEmptyContentText,
  itemsToRender,
  modalContentConfig,
  modalCancelButtonText,
  onModalCancelAction,
  modalOkButtonText,
  onModalOkAction,
  columnClassNames,
  itemKeyForModalTitle = 'name',
}: ITableCrudProps<T>) {
  const [modalContent, setModalContent] = useState<ReactNode | undefined>(
    undefined
  );
  const [item, setItem] = useState<AppModel<T>>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modalType, setModalType] = useState<ModalTypeValues>(ModalType.SHOW);
  const [showFooter, setShowFooter] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState<Selection>(new Set([20]));
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let items = Array.from(itemsToRender || []);
    const itemsPerPage = Number(Array.from(rowsPerPage)[0]);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    if (hasSearchFilter) {
      items = items.filter((item) => {
        const columnData = getValueOfTheKey<T>(
          columnOrKeyToFilterOnSearch.toString(),
          item
        );

        return columnData
          ?.toString()
          ?.toLowerCase()
          ?.includes(filterValue.toLowerCase());
      });
    }

    const pages = Math.ceil(items.length / itemsPerPage);
    setPages(pages);

    return items?.slice(start, end);
  }, [
    page,
    rowsPerPage,
    itemsToRender,
    hasSearchFilter,
    filterValue,
    columnOrKeyToFilterOnSearch,
  ]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const onGoToPageChange = useCallback((value?: string) => {
    if (value) {
      setPage(+value);
    }
  }, []);

  const renderCell = useCallback(renderCellContent, []);

  const defineTitleKey = useCallback((modalType?: ModalTypeValues): string => {
    if (modalType === 'show') return 'table.modals.showTitle';
    if (modalType === 'create') return 'table.modals.createTitle';
    if (modalType === 'update') return 'table.modals.updateTitle';
    return 'table.modals.deleteTitle';
  }, []);

  const createModalContent = useMemo(
    () => (
      <CreateOrUpdateForm
        {...(modalContentConfig('create') as ModalConfigReturnType<
          'create',
          T
        >)}
      />
    ),
    [modalContentConfig]
  );

  const deleteModalContent = useMemo(
    () => (
      <ShowKeyValueTable<T>
        {...(modalContentConfig('delete') as ModalConfigReturnType<'show', T>)}
      />
    ),
    [modalContentConfig]
  );

  const showModalContent = useMemo(
    () => (
      <ShowKeyValueTable<T>
        {...(modalContentConfig('show') as ModalConfigReturnType<'show', T>)}
      />
    ),
    [modalContentConfig]
  );

  const updateModalContent = useMemo(
    () => (
      <CreateOrUpdateForm
        {...(modalContentConfig('update') as ModalConfigReturnType<
          'update',
          T
        >)}
      />
    ),
    [modalContentConfig]
  );

  const topContent = useMemo(() => {
    return (
      <TableCrudTopContent
        title={t('table.name', {
          entityName: t(entityNameTranslationKey, { count: 0 }),
        })}
        newItemButtonTooltipText={newItemButtonTooltipText}
        onPress={() => {
          setShowFooter(false);
          setModalType(ModalType.CREATE);
          setModalContent(createModalContent);
          onOpen();
        }}
        searchPlaceholder={t('table.search.placeholder')}
        filterValue={filterValue}
        onClear={() => onClear()}
        onSearchChange={onSearchChange}
        totalItemsText={t('table.totalItems', {
          from:
            Number(Array.from(rowsPerPage)[0]) * page -
            Number(Array.from(rowsPerPage)[0]) +
            1,
          to:
            Number(Array.from(rowsPerPage)[0]) * page -
            (Number(Array.from(rowsPerPage)[0]) - filteredItems.length),
          total: itemsToRender?.length,
          entityName: t(entityNameTranslationKey, {
            count: filteredItems.length,
          }),
        })}
      />
    );
  }, [
    entityNameTranslationKey,
    filterValue,
    filteredItems,
    itemsToRender,
    newItemButtonTooltipText,
    onClear,
    onOpen,
    onSearchChange,
    setModalContent,
    createModalContent,
    rowsPerPage,
    page,
    t,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <TableCrudBottomContent
        page={page}
        pages={pages}
        onChange={(page) => setPage(page)}
        showGoToPage
        onGoToPageChange={onGoToPageChange}
        itemsPerPage={rowsPerPage}
        itemsPerPageTxt={upperFirst(t('table.rowsPerPage'))}
        onSelectionChange={setRowsPerPage}
      />
    );
  }, [onGoToPageChange, page, pages, rowsPerPage, t]);

  return (
    <div className="flex flex-col w-full">
      <Table
        isHeaderSticky
        isStriped={isStriped}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        aria-label={t('table.name', {
          entityName: t(entityNameTranslationKey, { count: 0 }),
        })}
        classNames={{ base: 'max-h-[47rem]', table: 'min-h-[14.5rem]' }}
        topContentPlacement="outside"
        topContent={topContent}
        bottomContentPlacement="outside"
        bottomContent={bottomContent}
      >
        <TableHeader columns={tableHeaderColumnsNames}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={`uppercase ${
                column.key === 'actions' ? 'text-right' : column.classNames
              } ${columnClassNames?.[column.key]}`}
              allowsSorting={!!column.allowsSorting}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={tableEmptyContentText}
          items={filteredItems}
          isLoading={isLoading}
          loadingContent={<Spinner label={t('loading')} />}
        >
          {(data) => (
            <TableRow key={data.id}>
              {(columnKey) => (
                <TableCell
                  key={`${columnKey}-${data.id}`}
                  className={`text-left px-4 capitalize ${
                    columnClassNames?.[columnKey.toString()]
                  }`}
                >
                  {renderCell({
                    columnName: columnKey,
                    data: data,
                    onDeleteAction: async () => {
                      setShowFooter(true);
                      setItem(data);
                      setModalType(ModalType.DELETE);
                      setModalContent(deleteModalContent);
                      onOpen();
                    },
                    onShowAction: () => {
                      setShowFooter(false);
                      setItem(data);
                      setModalType(ModalType.SHOW);
                      setModalContent(showModalContent);
                      onOpen();
                    },
                    onUpdateAction: () => {
                      setShowFooter(false);
                      setItem(data);
                      setModalType(ModalType.UPDATE);
                      setModalContent(updateModalContent);
                      onOpen();
                    },
                    deleteTooltipText: t('table.tooltips.delete'),
                    showTooltipText: t('table.tooltips.show'),
                    updateTooltipText: t('table.tooltips.update'),
                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ModalCrud<AppModel<T>>
        item={item}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalCrud.Header>
          <h1 className="uppercase">
            {t(defineTitleKey(modalType), {
              entityName: t(entityNameTranslationKey, { count: 1 }),
              itemName: getValueOfTheKey(itemKeyForModalTitle, item),
            })}
          </h1>
        </ModalCrud.Header>
        {modalContent}
        {showFooter && (
          <ModalCrud.Footer
            cancelAction={onModalCancelAction}
            okAction={async () => {
              await onModalOkAction('delete', item);
            }}
            cancelButtonText={modalCancelButtonText}
            okButtonText={modalOkButtonText}
          />
        )}
      </ModalCrud>
    </div>
  );
}
