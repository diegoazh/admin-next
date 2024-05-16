import { MouseEvent, useEffect, useState } from 'react';
import { readDarkMode } from '../utils/functions';

export const useDarkMode = () => {
  const [isThemeDefined, setTheme] = useState(
    !!globalThis?.localStorage?.getItem('theme')
  );
  const [isDarkModeEnabled, setDarkMode] = useState(
    globalThis?.localStorage?.theme
      ? globalThis?.localStorage.getItem('theme') === 'dark'
      : globalThis?.matchMedia && globalThis?.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    readDarkMode();
  }, []);

  const enableDarkMode = (ev: MouseEvent) => {
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
  };

  const systemMode = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    globalThis?.localStorage.removeItem('theme');
    setTheme(!!globalThis?.localStorage.getItem('theme'));
    setDarkMode(isSystemDarkMode());
    readDarkMode();
  };

  const isSystemDarkMode = (): boolean =>
    !globalThis?.localStorage.getItem('theme') &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return {
    isDarkModeEnabled,
    isThemeDefined,
    enableDarkMode,
    systemMode,
    isSystemDarkMode,
  };
};
