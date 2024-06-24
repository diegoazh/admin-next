import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { readDarkMode } from '../utils/functions';

export const useDarkMode = () => {
  const [isThemeDefined, setTheme] = useState(false);
  const [isDarkModeEnabled, setDarkMode] = useState(false);

  useEffect(() => {
    readDarkMode();
    setTheme(!!globalThis?.localStorage?.getItem('theme'));
    setDarkMode(
      globalThis?.localStorage?.theme
        ? globalThis?.localStorage.getItem('theme') === 'dark'
        : globalThis?.matchMedia &&
            globalThis?.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }, []);

  const isSystemDarkMode = useCallback(
    (): boolean =>
      !globalThis?.localStorage.getItem('theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    []
  );

  const enableDarkMode = useCallback(
    (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (isDarkModeEnabled) {
        globalThis?.localStorage.setItem('theme', 'light');
        setDarkMode(false);
      } else {
        globalThis?.localStorage.setItem('theme', 'dark');
        setDarkMode(true);
      }

      setTheme(!!globalThis?.localStorage.getItem('theme'));
      readDarkMode();
    },
    [isDarkModeEnabled]
  );

  const systemMode = useCallback((ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    globalThis?.localStorage.removeItem('theme');
    setTheme(!!globalThis?.localStorage.getItem('theme'));
    setDarkMode(isSystemDarkMode());
    readDarkMode();
  }, [isSystemDarkMode]);

  return {
    isDarkModeEnabled,
    isThemeDefined,
    enableDarkMode,
    systemMode,
    isSystemDarkMode,
  };
};
