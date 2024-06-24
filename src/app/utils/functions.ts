import { Dinero, toDecimal } from 'dinero.js';
import capitalize from 'lodash.capitalize';
import { isValidElement } from 'react';
import { FetcherArrayArgs } from '../types';
import { CommonHeaders, RequestMethods } from './constants';

/************************************
 * DARK MODE HELPERS
 ************************************/
export function readDarkMode(): void {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.body.classList.add('dark');
    document.body.classList.add('text-foreground');
    document.body.classList.add('bg-background');
  } else {
    document.body.classList.remove('dark');
    document.body.classList.remove('text-foreground');
    document.body.classList.remove('bg-background');
  }
}

/************************************
 * FETCHER HELPERS
 ************************************/
export async function fetcher<T = any>(...args: FetcherArrayArgs): Promise<T> {
  return fetch(...args)
    .then((res) => res.json())
    .then((res) => res?.data)
    .catch((error) => {
      console.error(error);
    });
}

export function apiGetter<T>(query = ''): (url: string) => Promise<T> {
  return (url: string): Promise<T> => {
    let uri = url;

    if (query && !/\?/.test(url)) {
      uri = `${url}?${query}`;
    }

    return fetcher<T>(uri, {
      method: RequestMethods.GET,
      headers: { ...CommonHeaders },
    });
  };
}

export async function apiMutator<T>(
  [url, method]: [
    url: URL | RequestInfo,
    (typeof RequestMethods)[keyof typeof RequestMethods]
  ],
  { arg }: { arg?: RequestInit }
): Promise<T> {
  const body =
    arg?.body && typeof arg.body === 'string' ? JSON.parse(arg.body) : {};
  const { id } = body;

  return fetcher<T>(method !== 'POST' && id ? `${url}/${id}` : url, {
    ...arg,
    method,
    headers: { ...CommonHeaders, ...arg?.headers },
  });
}

/************************************
 * DINEROJS HELPERS
 ************************************/
export function moneyParser(money: Dinero<number>): {
  txt: string;
  num: string;
} {
  return toDecimal(money, ({ currency, value }) => ({
    txt: `${currency.code} $${Number(value).toLocaleString('es-AR')}`,
    num: value,
  }));
}

/************************************
 * STRING HELPERS
 ************************************/
export function upperFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/************************************
 * STRING HELPERS
 ************************************/
export function flatObject(obj: object, keysToExclude: string[] = []) {
  let tmpEntry: [string, any][] = [];
  let tmpKey = '';
  let entries = Object.entries(obj);
  const flattened: Record<string | number | symbol, any> = {};

  while (entries.length) {
    for (let [key, value] of entries) {
      if (keysToExclude.includes(tmpKey ? `${tmpKey}.${key}` : key)) {
        continue;
      } else if (Array.isArray(value)) {
        value.forEach((val, i) => {
          const key1 = tmpKey ? `${tmpKey}.${key}.${i}` : `${key}.${i}`;
          flattened[key1] = val;
        });
      } else if (value instanceof Date) {
        flattened[key] = value;
      } else if (isValidElement(value)) {
        flattened[key] = value;
      } else if (typeof value === 'object' && value != null) {
        const key2 = tmpKey ? `${tmpKey}.${key}` : key;
        tmpEntry.push([key2, Object.entries(value)]);
      } else {
        const key3 = tmpKey ? `${tmpKey}.${key}` : key;
        flattened[key3] = value;
      }
    }

    console.log(tmpEntry);
    const firstEntry = tmpEntry.splice(0, 1)[0];
    tmpKey = firstEntry?.[0] || '';
    entries = firstEntry?.[1] || [];
  }

  return flattened;
}

/************************************
 * COMPONENT UI HELPERS
 ************************************/
export function buildAutocompleteCollectionItems(
  originalCollection?: Array<Record<'id' | 'name', string>>
) {
  const finalCollection = originalCollection || [];

  return finalCollection.reduce(
    (collection, item) => [
      ...collection,
      { value: item.id, label: capitalize(item.name) },
    ],
    [] as Array<Record<'value' | 'label', string>>
  );
}

export function getValueOfTheKey<T, U = any>(
  key: string,
  item: any
): U | undefined {
  if (item) {
    return ((key as string).split('.') as (keyof T)[]).reduce(
      (value, col) => value[col],
      item
    );
  }

  return undefined;
}
