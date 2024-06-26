import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Chip, Tooltip } from '@nextui-org/react';
import React from 'react';
import { Translation } from 'react-i18next';
import { getValueOfTheKey } from './functions';

export interface IRenderCellContentProps<T> {
  columnName: React.Key;
  data: T;
  onShowAction: () => void;
  onUpdateAction: () => void;
  onDeleteAction: () => void;
  showTooltipText: string;
  updateTooltipText: string;
  deleteTooltipText: string;
}

export function renderCellContent<T>({
  columnName,
  data,
  showTooltipText,
  updateTooltipText,
  deleteTooltipText,
  onDeleteAction,
  onShowAction,
  onUpdateAction,
}: IRenderCellContentProps<T>) {
  const columnData = getValueOfTheKey<T>(columnName.toString(), data);

  if (columnName === 'actions') {
    return (
      <div className="flex justify-end">
        <Tooltip
          showArrow
          placement="top"
          className="capitalize"
          content={showTooltipText}
        >
          <span
            className="text-lg text-primary-300 cursor-pointer active:opacity-50 px-2"
            onClick={onShowAction}
          >
            <EyeIcon className="w-6" />
          </span>
        </Tooltip>
        <Tooltip
          showArrow
          placement="top"
          className="capitalize"
          content={updateTooltipText}
        >
          <span
            className="text-lg text-warning-300 cursor-pointer active:opacity-50 px-2"
            onClick={onUpdateAction}
          >
            <PencilIcon className="w-6" />
          </span>
        </Tooltip>
        <Tooltip
          showArrow
          placement="top"
          className="capitalize"
          content={deleteTooltipText}
        >
          <span
            className="text-lg text-danger cursor-pointer active:opacity-50 px-2"
            onClick={onDeleteAction}
          >
            <TrashIcon className="w-6" />
          </span>
        </Tooltip>
      </div>
    );
  }

  if (typeof columnData === 'boolean') {
    return columnData ? (
      <Chip variant="bordered" color="success">
        <Translation>{(t, { i18n }) => t('yes')}</Translation>
      </Chip>
    ) : (
      <Chip variant="bordered" color="danger">
        <Translation>{(t, { i18n }) => t('no')}</Translation>
      </Chip>
    );
  }

  return columnData;
}
