import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button, Input, Tooltip } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export interface ITableCrudTopContentProps {
  title: string;
  newItemButtonTooltipText: string;
  onPress: () => void;
  filterValue: string;
  onClear: () => void;
  onSearchChange: () => void;
  totalItemsText: string;
}

export function TableCrudTopContent({
  title,
  newItemButtonTooltipText,
  onPress,
  filterValue,
  onClear,
  onSearchChange,
  totalItemsText,
}: ITableCrudTopContentProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="flex px-2">
        <h1 className='text-default-500 font-bold'>{title}</h1>
      </div>
      <div className="flex justify-between p-2">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder={t('table.search.placeholder')}
          startContent={<MagnifyingGlassIcon className="w-6" />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
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
            onPress={onPress}
          >
            <PlusIcon className="w-4" />
          </Button>
        </Tooltip>
      </div>
      <div className="flex px-2">
        <small className='text-default-400'>{totalItemsText}</small>
      </div>
    </div>
  );
}
