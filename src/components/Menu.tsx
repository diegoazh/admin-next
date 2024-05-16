'use client';

import {
  BriefcaseIcon,
  BuildingLibraryIcon,
  ChartBarSquareIcon,
  ShoppingBagIcon,
  TagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  Listbox,
  ListboxItem,
  ListboxSection,
  Selection,
} from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IMenuSectionItems {
  key: string;
  text: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onPress: () => void;
}

interface IMenuSection {
  title: string;
  content: IMenuSectionItems[];
}

export const Menu = () => {
  const router = useRouter();
  const path = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([path.replace('/', '') || 'sells'])
  );
  const { t } = useTranslation();

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(', '),
    [selectedKeys]
  );

  const menuContent: IMenuSection[] = [
    {
      title: t('menu.subtitle.actions'),
      content: [
        {
          key: 'sells',
          text: t('menu.sell'),
          startContent: <ShoppingBagIcon className="w-4" />,
          onPress() {},
        },
        {
          key: 'expenses',
          text: t('menu.expenses'),
          startContent: <BuildingLibraryIcon className="w-4" />,
          onPress() {},
        },
        {
          key: 'stock',
          text: t('menu.stock'),
          startContent: <ChartBarSquareIcon className="w-4" />,
          onPress() {},
        },
      ],
    },
    {
      title: t('menu.subtitle.aux'),
      content: [
        {
          key: 'products',
          text: t('menu.products'),
          startContent: <BriefcaseIcon className="w-4" />,
          onPress() {
            router.push('/products');
          },
        },
        {
          key: 'suppliers',
          text: t('menu.suppliers'),
          startContent: <UserGroupIcon className="w-4" />,
          onPress() {},
        },
        {
          key: 'categories',
          text: t('menu.categories'),
          startContent: <TagIcon className="w-4" />,
          onPress() {
            router.push('/categories');
          },
        },
      ],
    },
  ];

  return (
    <Listbox
      aria-label="Single selection example"
      variant="flat"
      disallowEmptySelection
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    >
      {menuContent.map((section, index) => (
        <ListboxSection key={index} title={section.title} showDivider>
          {section.content.map((item) => (
            <ListboxItem
              key={item.key}
              startContent={item.startContent}
              endContent={item.endContent}
              onPress={item.onPress}
              className="capitalize"
            >
              {item.text}
            </ListboxItem>
          ))}
        </ListboxSection>
      ))}
    </Listbox>
  );
};
