import {
  Input,
  Pagination,
  Select,
  SelectItem,
  Selection,
} from '@nextui-org/react';
import { Key } from 'react';
import { useTranslation } from 'react-i18next';
import { upperFirst } from '../utils';

export interface ITableCrudBottomContentProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  onClear?: () => void;
  onGoToPageChange: () => void;
  showGoToPage: boolean;
  itemsPerPage: Selection;
  itemsPerPageTxt: string;
  onSelectionChange: (key: Selection) => any;
}

export function TableCrudBottomContent({
  onChange,
  page,
  pages,
  onClear,
  onGoToPageChange,
  showGoToPage,
  itemsPerPage,
  itemsPerPageTxt,
  onSelectionChange,
}: ITableCrudBottomContentProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row">
      <div className="flex w-full justify-start">
        <Select
          label={itemsPerPageTxt}
          selectionMode="single"
          selectedKeys={itemsPerPage}
          onSelectionChange={onSelectionChange}
          className="w-36"
        >
          <SelectItem key={10}>10</SelectItem>
          <SelectItem key={20}>20</SelectItem>
          <SelectItem key={50}>50</SelectItem>
          <SelectItem key={100}>100</SelectItem>
          <SelectItem key={150}>150</SelectItem>
        </Select>
      </div>
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={onChange}
        />
      </div>
      {showGoToPage && (
        <div className="flex w-full justify-end">
          <Input
            isClearable
            className="w-[8rem] sm:max-w-[44%]"
            placeholder={upperFirst(t('table.goToPage.placeholder'))}
            onClear={onClear}
            onValueChange={onGoToPageChange}
          />
        </div>
      )}
    </div>
  );
}
