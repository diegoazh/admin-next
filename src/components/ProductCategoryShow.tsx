import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalCrudContext } from './TableCrudModal';

export function ProductCategoryShow() {
  const { t } = useTranslation();
  const { item } = useContext(ModalCrudContext);

  const keys = Object.keys(item);
  const tableEmptyContentText = t('table.emptyContent');

  return (
    <Table aria-label={t('categories.show.table')} isStriped>
      <TableHeader>
        <TableColumn className="uppercase">
          {t('categories.show.columns.item')}
        </TableColumn>
        <TableColumn className="uppercase">
          {t('categories.show.columns.value')}
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={tableEmptyContentText}>
        {keys.map((key, i) => (
          <TableRow key={i}>
            <TableCell className="capitalize">{key}</TableCell>
            <TableCell>{item[key]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
