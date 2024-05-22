import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import { ProductCategoryEntity, ProductEntity } from '../models';
import { RequestMethods, apiGetter, apiMutator } from '../utils';

const baseUrl = `https://app.starter.io`;
export const productsKey = `${baseUrl}/products`;
export const productCategoriesKey = `${baseUrl}/product-categories`;

export function useProductCategories<
  T = ProductCategoryEntity[]
>(): SWRResponse<T> {
  return useSWR<T>(
    productCategoriesKey,
    apiGetter<T>('order[0]=name&order[0]=ASC')
  );
}

export function useMutateProductCategory<T = unknown>(
  method: (typeof RequestMethods)[keyof typeof RequestMethods]
) {
  return useSWRMutation<
    T,
    any,
    [
      typeof productCategoriesKey,
      (typeof RequestMethods)[keyof typeof RequestMethods]
    ],
    RequestInit
  >([productCategoriesKey, method], apiMutator);
}

export function useProducts<T = ProductEntity[]>(): SWRResponse<T> {
  return useSWR<T>(productsKey, apiGetter<T>('order[0]=name&order[0]=ASC'));
}

export function useMutateProducts<T = unknown>(
  method: (typeof RequestMethods)[keyof typeof RequestMethods]
) {
  return useSWRMutation<
    T,
    any,
    [typeof productsKey, (typeof RequestMethods)[keyof typeof RequestMethods]],
    RequestInit
  >([productsKey, method], apiMutator);
}
