import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Key, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppEntities, AppEntity } from '../types';
import { ModalContextType, ModalCrudContext } from './TableCrudModal';

export type IDefineShowCellContentFn = (
  columnKey: Key,
  item?: Record<string, any>
) => string | JSX.Element | undefined;

export interface IShowItemTableProps {
  tableTitle: string;
  headerColumns: { key: string; label: string }[];
  defineCellContent: IDefineShowCellContentFn;
}

export function ShowKeyValueItemTable<T extends AppEntities>({
  tableTitle,
  headerColumns,
  defineCellContent,
}: IShowItemTableProps) {
  const { t } = useTranslation();
  const { item } = useContext<ModalContextType<T>>(ModalCrudContext);

  const tableEmptyContentText = t('table.emptyContent');
  const reducedItem = (Object.keys(item || {}) as (keyof AppEntity<T>)[]).map(
    (key) => ({
      key: `${headerColumns[0].key}-${key?.toString()}`,
      [headerColumns[0].key]: t(key?.toString(), key?.toString()).toUpperCase(),
      [headerColumns[1].key]: item?.[key],
    })
  );

  return (
    <Table aria-label={tableTitle} isStriped>
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.key} className="uppercase">
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={tableEmptyContentText} items={reducedItem}>
        {(item) => (
          <TableRow key={`${item.key}-row`}>
            {(columnKey) => (
              <TableCell
                key={`${item?.key}-${columnKey}`}
                className="capitalize"
              >
                {defineCellContent(columnKey, item)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
