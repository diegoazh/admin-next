import {
  CheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';

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
      </div>
    );
  }

  return iconsForBooleanValuesOrContent(data[columnName]);
}