import { Pagination } from '@nextui-org/react';

export interface ITableCrudBottomContentProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

export function TableCrudBottomContent({
  onChange,
  page,
  pages,
}: ITableCrudBottomContentProps) {
  return (
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
  );
}
