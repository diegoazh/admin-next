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
import { TableCrudBottomContent } from './TableCrudBottomContent';
import { TableCrudCellContent } from './TableCrudCellContent';
import { ITableCrudModalProps, TableCrudModal } from './TableCrudModal';
import { TableCrudTopContent } from './TableCrudTopContent';

export interface ITableCrudProps<T> {
  isStriped?: boolean;
  columnActionName: string;
  entityName: string;
  newItemButtonTooltipText: string;
  tableName: string;
  tableHeaderColumnsNames: string[];
  tableColumns: string[];
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
  columnActionName,
  entityName,
  isStriped = false,
  newItemButtonTooltipText,
  tableName,
  tableHeaderColumnsNames,
  tableColumns,
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
      items = items.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    const pages = Math.ceil(items.length / rowsPerPage);
    setPages(pages);

    return items?.slice(start, end);
  }, [page, tableContent, hasSearchFilter, filterValue]);

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

  const modalProps: ITableCrudModalProps<U> = {
    entityName: t(entityName, { count: 1 }),
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
            title={t('table.name', { entityName: t(entityName, { count: 0 }) })}
            newItemButtonTooltipText={newItemButtonTooltipText}
            onPress={() => {
              setModalType('create');
              onOpen();
            }}
            filterValue={filterValue}
            onClear={() => onClear()}
            onSearchChange={onSearchChange}
            totalItemsText={t('table.totalItems', {
              total: filteredItems.length * pages,
              entityName: t(entityName, { count: filteredItems.length }),
            })}
          />
        }
        bottomContentPlacement="outside"
        bottomContent={
          <TableCrudBottomContent
            page={page}
            pages={pages}
            onChange={(page) => setPage(page)}
          />
        }
      >
        <TableHeader>
          {[...tableHeaderColumnsNames, columnActionName].map(
            (column, index) => (
              <TableColumn
                key={index}
                className={`uppercase ${
                  column === columnActionName ? 'text-right' : 'text-left'
                }`}
              >
                {column}
              </TableColumn>
            )
          )}
        </TableHeader>
        <TableBody emptyContent={tableEmptyContentText} items={filteredItems}>
          {(data) => (
            <TableRow key={data.id}>
              {[...tableColumns, 'actions'].map((column, j) => (
                <TableCell key={j} className="text-left px-4 capitalize">
                  <TableCrudCellContent
                    columnName={column}
                    data={data}
                    onDeleteAction={async () => {
                      setItem(data);
                      setModalType('delete');
                      onOpen();
                    }}
                    onShowAction={() => {
                      setItem(data);
                      setModalType('show');
                      onOpen();
                    }}
                    onUpdateAction={() => {
                      setItem(data);
                      setModalType('update');
                      onOpen();
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TableCrudModal {...modalProps} />
    </div>
  );
}
