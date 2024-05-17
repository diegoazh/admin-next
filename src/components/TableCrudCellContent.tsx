import {
  CheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button, Tooltip } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export interface ITableCrudCellContentProps {
  columnName: string;
  data: any;
  onShowAction: () => void;
  onUpdateAction: () => void;
  onDeleteAction: () => void;
}

export function TableCrudCellContent({
  columnName,
  data,
  onShowAction,
  onUpdateAction,
  onDeleteAction,
}: ITableCrudCellContentProps) {
  const { t } = useTranslation();

  const iconsForBooleanValuesOrContent = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon className="w-5" />
      ) : (
        <XMarkIcon className="w-5" />
      );
    }

    return value;
  };

  if (columnName === 'actions') {
    return (
      <div className="flex justify-end">
        <Tooltip
          showArrow
          placement="top"
          className="capitalize"
          content={t('table.tooltips.show')}
        >
          <Button
            isIconOnly
            variant="solid"
            color="primary"
            aria-label="see"
            className="rounded-full mr-2"
            onPress={onShowAction}
          >
            <EyeIcon className="w-4" />
          </Button>
        </Tooltip>
        <Tooltip
          showArrow
          placement="top"
          className="capitalize"
          content={t('table.tooltips.update')}
        >
          <Button
            isIconOnly
            variant="solid"
            color="warning"
            aria-label="edit"
            className="rounded-full mr-2"
            onPress={onUpdateAction}
          >
            <PencilIcon className="w-4" />
          </Button>
        </Tooltip>
        <Tooltip
          showArrow
          placement="top"
          className="capitalize"
          content={t('table.tooltips.delete')}
        >
          <Button
            isIconOnly
            variant="solid"
            color="danger"
            aria-label="trash"
            className="rounded-full mr-2"
            onPress={onDeleteAction}
          >
            <TrashIcon className="w-4" />
          </Button>
        </Tooltip>
      </div>
    );
  }

  const cols = columnName.split('.');
  const columnData = cols.reduce((result, col) => result[col], data);
  
  return iconsForBooleanValuesOrContent(columnData);
}
