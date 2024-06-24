import { useTranslation } from 'react-i18next';

export function useKeyValueHeaderColumns() {
  const { t } = useTranslation();

  return [
    { key: 'property', label: t('table.show.columns.property') },
    { key: 'value', label: t('table.show.columns.value') },
  ];
}
