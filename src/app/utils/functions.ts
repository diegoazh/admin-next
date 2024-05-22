import { FetcherArrayArgs } from '../types';
import { CommonHeaders, RequestMethods } from './constants';

/************************************
 * DARK MODE
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
 * FETCHER FNS
 ************************************/
export async function fetcher<T = any>(...args: FetcherArrayArgs): Promise<T> {
  return fetch(...args)
    .then((res) => res.json())
    .then((res) => res?.data)
    .catch((error) => {
      console.error(error);
    });
}

export function apiGetter<T>(query: string): (url: string) => Promise<T> {
  return (url: string): Promise<T> =>
    fetcher<T>(`${url}?${query}`, {
      method: RequestMethods.GET,
      headers: { ...CommonHeaders },
    });
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
