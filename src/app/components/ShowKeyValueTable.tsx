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
import { useKeyValueHeaderColumns } from '../hooks';
import { AppModel, AppModels } from '../types';
import { ModalContextType, ModalCrudContext } from './ModalCrud';

export type ShowKeyValueItem = {
  key: string;
  property: string;
  value:
    | string
    | number
    | JSX.Element
    | null
    | undefined;
};
export type KeyValueBuilderFn<T extends AppModels> = (
  item?: AppModel<T>
) => ShowKeyValueItem[];
export type DefineShowCellContentFn = (
  columnKey: Key,
  item: ShowKeyValueItem
) => string | number | JSX.Element | null | undefined;

export interface IShowItemTableProps<T extends AppModels> {
  tableTitle: string;
  defineCellContent: DefineShowCellContentFn;
  keyValueBuilder: KeyValueBuilderFn<T>;
}

export function ShowKeyValueTable<T extends AppModels>({
  tableTitle,
  defineCellContent,
  keyValueBuilder,
}: IShowItemTableProps<T>) {
  const { t } = useTranslation();
  const { item } = useContext<ModalContextType<T>>(ModalCrudContext);

  const headerColumns = useKeyValueHeaderColumns();
  const tableEmptyContentText = t('table.emptyContent');
  const items = keyValueBuilder(item);

  return (
    <Table aria-label={tableTitle} isStriped>
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.key} className="uppercase">
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={tableEmptyContentText} items={items}>
        {(item) => {
          return (
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
          );
        }}
      </TableBody>
    </Table>
  );
}
