import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppEntities, AppEntity } from '../app/models';
import { renderCellContent } from '../app/utils/fns';
import { TableCrudBottomContent } from './TableCrudBottomContent';
import { ITableCrudModalProps, TableCrudModal } from './TableCrudModal';
import { TableCrudTopContent } from './TableCrudTopContent';

export interface ITableCrudProps<T> {
  isStriped?: boolean;
  entityNameTranslationKey: string;
  newItemButtonTooltipText: string;
  tableName: string;
  tableHeaderColumnsNames: { key: string; label: string }[];
  columnToFilterOnSearch: keyof T;
  tableEmptyContentText: string;
  tableContent?: T[];
  modalCreateContent: React.ReactNode;
  modalShowContent: React.ReactNode;
  modalUpdateContent: React.ReactNode;
  modalDeleteContent: React.ReactNode;
  modalCancelButtonText: string;
  onModalCancelAction: () => void;
  modalOkButtonText: string;
  onModalOkAction: (
    modalType?: 'show' | 'create' | 'update' | 'delete',
    item?: any
  ) => void | Promise<void>;
}

export function TableCrud<T extends AppEntities, U extends AppEntity<T>>({
  entityNameTranslationKey,
  isStriped = false,
  newItemButtonTooltipText,
  tableName,
  tableHeaderColumnsNames,
  columnToFilterOnSearch,
  tableEmptyContentText,
  tableContent,
  modalCreateContent,
  modalDeleteContent,
  modalShowContent,
  modalUpdateContent,
  modalCancelButtonText,
  onModalCancelAction,
  modalOkButtonText,
  onModalOkAction,
}: ITableCrudProps<U>) {
  const [modalType, setModalType] = useState<
    'show' | 'create' | 'update' | 'delete' | undefined
  >(undefined);
  const [item, setItem] = useState<U>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterValue, setFilterValue] = useState('');
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const rowsPerPage = 10;
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let items = Array.from(tableContent || []);
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (hasSearchFilter) {
      items = items.filter((item) =>
        item[columnToFilterOnSearch]
          ?.toString()
          ?.toLowerCase()
          ?.includes(filterValue.toLowerCase())
      );
    }

    const pages = Math.ceil(items.length / rowsPerPage);
    setPages(pages);

    return items?.slice(start, end);
  }, [
    page,
    tableContent,
    hasSearchFilter,
    filterValue,
    columnToFilterOnSearch,
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

  const modalProps: ITableCrudModalProps<U> = {
    entityName: t(entityNameTranslationKey, { count: 1 }),
    item,
    isOpen,
    showFooter: modalType === 'delete',
    showModalCancelButton: modalType === 'delete',
    modalCancelButtonText,
    onModalCancelAction,
    modalContent:
      modalType === 'create'
        ? modalCreateContent
        : modalType === 'show'
        ? modalShowContent
        : modalType === 'update'
        ? modalUpdateContent
        : modalDeleteContent,
    onModalOkAction: async () => onModalOkAction(modalType, item),
    modalOkButtonText,
    showModalOkButton: modalType !== 'show',
    modalType,
    onOpenChange,
  };

  return (
    <div className="flex flex-col w-full">
      <Table
        isHeaderSticky
        aria-label={tableName}
        isStriped={isStriped}
        classNames={{ base: 'max-h-[47rem]', table: 'min-h-[14.5rem]' }}
        topContentPlacement="outside"
        topContent={
          <TableCrudTopContent
            title={t('table.name', {
              entityName: t(entityNameTranslationKey, { count: 0 }),
            })}
            newItemButtonTooltipText={newItemButtonTooltipText}
            onPress={() => {
              setModalType('create');
              onOpen();
            }}
            searchPlaceholder={t('table.search.placeholder')}
            filterValue={filterValue}
            onClear={() => onClear()}
            onSearchChange={onSearchChange}
            totalItemsText={t('table.totalItems', {
              from: rowsPerPage * page - rowsPerPage + 1,
              to: rowsPerPage * page - (rowsPerPage - filteredItems.length),
              total: tableContent?.length,
              entityName: t(entityNameTranslationKey, {
                count: filteredItems.length,
              }),
            })}
          />
        }
        bottomContentPlacement="outside"
        bottomContent={
          <TableCrudBottomContent
            page={page}
            pages={pages}
            onChange={(page) => setPage(page)}
            showGoToPage
            onGoToPageChange={onGoToPageChange}
          />
        }
      >
        <TableHeader columns={tableHeaderColumnsNames}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={`uppercase ${
                column.key === 'actions' ? 'text-right' : 'text-left'
              }`}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={tableEmptyContentText} items={filteredItems}>
          {(data) => (
            <TableRow key={data.id}>
              {(columnKey) => (
                <TableCell
                  key={`${columnKey}-${data.id}`}
                  className="text-left px-4 capitalize"
                >
                  {renderCell({
                    columnName: columnKey,
                    data: data,
                    onDeleteAction: async () => {
                      setItem(data);
                      setModalType('delete');
                      onOpen();
                    },
                    onShowAction: () => {
                      setItem(data);
                      setModalType('show');
                      onOpen();
                    },
                    onUpdateAction: () => {
                      setItem(data);
                      setModalType('update');
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
      <TableCrudModal {...modalProps} />
    </div>
  );
}
