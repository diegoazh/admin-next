'use client';

import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  ButtonGroup,
  NextUIProvider,
  Tooltip,
} from '@nextui-org/react';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from './components';
import './globals.css';
import { useDarkMode } from './hooks';
import './i18n-next';
import { upperFirst } from './utils';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();
  const [darkEnabled, setDarkEnabled] = useState(false);
  const { enableDarkMode, isDarkModeEnabled, isThemeDefined, systemMode } =
    useDarkMode();

  useEffect(() => {
    setDarkEnabled(isDarkModeEnabled);
  }, [isDarkModeEnabled]);

  return (
    <html lang="es-AR">
      <body
        className={`dark text-foreground bg-background ${inter.className} p-4 min-h-screen`}
      >
        <NextUIProvider>
          <div className="grid grid-flow-col grid-cols-3">
            <div className="col-span-1 col-start-2">
              <h1 className="mx-auto p-4 text-3xl text-center">Origami</h1>
            </div>
            <div className="col-span-3 text-right">
              <ButtonGroup size="sm">
                <Tooltip
                  placement="left"
                  content={upperFirst(
                    t(darkEnabled ? 'header.lightMode' : 'header.darkMode')
                  )}
                >
                  <Button
                    isIconOnly
                    variant="bordered"
                    aria-label="dark mode"
                    color={isThemeDefined ? 'primary' : 'default'}
                    onClick={(ev) => enableDarkMode(ev)}
                  >
                    {darkEnabled ? (
                      <SunIcon className="w-4" />
                    ) : (
                      <MoonIcon className="w-4" />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip
                  placement="bottom"
                  content={upperFirst(t('header.byOS'))}
                >
                  <Button
                    isIconOnly
                    variant="bordered"
                    aria-label="dark mode"
                    color={!isThemeDefined ? 'primary' : 'default'}
                    onClick={(ev) => systemMode(ev)}
                  >
                    <ComputerDesktopIcon className="w-4" />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
          <div className="grid grid-flow-col grid-cols-12">
            <aside className="col-span-2 py-2 pl-2 pr-4">
              <Menu />
            </aside>
            <main className="col-span-10 py-4 pl-2 pr-4">{children}</main>
          </div>
          <div className="grid grid-flow-col grid-cols-1">
            <small className="mx-auto p-2">copyright</small>
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
