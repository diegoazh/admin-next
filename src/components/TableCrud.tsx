import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppEntity, AppEntities } from '../app/models';
import { TableCrudCellContent } from './TableCrudCellContent';
import { ITableCrudModalProps, TableCrudModal } from './TableCrudModal';

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
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      <div className="flex justify-between p-2">
        <h1 className="capitalize">{t(entityName, { count: 0 })}</h1>
        <Tooltip
          showArrow
          placement="left"
          className="capitalize"
          content={newItemButtonTooltipText}
        >
          <Button
            isIconOnly
            variant="solid"
            color="success"
            aria-label="dark mode"
            className="rounded-full"
            onPress={() => {
              setModalType('create');
              onOpen();
            }}
          >
            <PlusIcon className="w-4" />
          </Button>
        </Tooltip>
      </div>
      <div>
        <Table aria-label={tableName} isStriped={isStriped}>
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
          <TableBody emptyContent={tableEmptyContentText}>
            {tableContent?.length
              ? tableContent.map((data, i) => (
                  <TableRow key={i}>
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
                ))
              : []}
          </TableBody>
        </Table>
        <TableCrudModal {...modalProps} />
      </div>
    </div>
  );
}
