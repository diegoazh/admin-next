import {
  Code,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppEntities, ProductCategoryEntity } from '../app/models';
import { ModalCrudContext } from './TableCrudModal';

export function ProductCategoryShow() {
  const { t } = useTranslation();
  const { item } = useContext(ModalCrudContext);

  const keys = Object.keys(item || {}) as Array<keyof ProductCategoryEntity>;
  const tableEmptyContentText = t('table.emptyContent');
  const defineCellContent = (key: keyof AppEntities, item?: AppEntities) => {
    if (key === 'id') {
      return (
        <Code size="sm" className="text-small text-wrap">
          {item?.[key]}
        </Code>
      );
    }

    if (key === 'profit') {
      return `${item?.[key]} %`;
    }

    if (key === 'createdAt' || key === 'updatedAt' || key === 'deletedAt') {
      const date = item?.[key];
      return date ? new Date().toLocaleDateString() : '';
    }

    return item?.[key];
  };

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
            <TableCell>{defineCellContent(key, item)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
