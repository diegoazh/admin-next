import { Input, Pagination } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export interface ITableCrudBottomContentProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  onClear?: () => void;
  onGoToPageChange: () => void;
  showGoToPage: boolean;
}

export function TableCrudBottomContent({
  onChange,
  page,
  pages,
  onClear,
  onGoToPageChange,
  showGoToPage,
}: ITableCrudBottomContentProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row">
      <div className="flex w-full justify-start"></div>
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
      {showGoToPage && <div className="flex w-full justify-end">
        <Input
          isClearable
          className="w-[8rem] sm:max-w-[44%]"
          placeholder={t('table.goToPage.placeholder')}
          onClear={onClear}
          onValueChange={onGoToPageChange}
        />
      </div>}
    </div>
  );
}
