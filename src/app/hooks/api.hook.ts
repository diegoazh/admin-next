import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { ProductCategoryEntity } from '../models';
import { fetcher } from '../utils/functions';

const baseUrl = `https://app.starter.io`;
const CommonHeaders = {
  'content-type': 'application/json',
};
export const RequestMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;
export const productsKey = `${baseUrl}/products`;
export const productCategoriesKey = `${baseUrl}/product-categories`;

export function useProductCategories<
  T = ProductCategoryEntity[]
>(): SWRResponse<T> {
  return useSWR<T, any, typeof productCategoriesKey>(
    productCategoriesKey,
    (url) =>
      fetcher(url, {
        method: RequestMethods.GET,
        headers: { ...CommonHeaders },
      })
  );
}

export function useMutateProductCategory<T = unknown>(
  method: (typeof RequestMethods)[keyof typeof RequestMethods]
): SWRMutationResponse<
  T,
  any,
  [
    typeof productCategoriesKey,
    (typeof RequestMethods)[keyof typeof RequestMethods]
  ],
  RequestInit
> {
  return useSWRMutation<
    T,
    any,
    [
      typeof productCategoriesKey,
      (typeof RequestMethods)[keyof typeof RequestMethods]
    ],
    RequestInit
  >(
    [productCategoriesKey, method],
    (
      [url, method]: [
        url: URL | RequestInfo,
        (typeof RequestMethods)[keyof typeof RequestMethods]
      ],
      { arg }: { arg?: RequestInit }
    ) => {
      const body =
        arg?.body && typeof arg.body === 'string' ? JSON.parse(arg.body) : {};
      const { id } = body;
      return fetcher(method !== 'POST' && id ? `${url}/${id}` : url, {
        ...arg,
        method,
        headers: { ...CommonHeaders, ...arg?.headers },
      });
    }
  );
}

export function useProducts<T = unknown>(): SWRResponse<T> {
  return useSWR<T>(productsKey, fetcher);
}
