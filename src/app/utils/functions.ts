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

export type FetcherArrayArgs = [
  input: URL | RequestInfo,
  init?: RequestInit | undefined
];
export type FetcherObjectArgs = {
  input: URL | RequestInfo;
  init?: RequestInit | undefined;
};
export async function fetcher<T = any>(...args: FetcherArrayArgs): Promise<T> {
  return fetch(...args)
    .then((res) => res.json())
    .then((res) => res?.data)
    .catch((error) => {console.error(error); alert(error)});
}
