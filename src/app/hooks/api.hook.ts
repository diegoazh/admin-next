import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import {
  ProductCategoryEntity,
  ProductEntity,
  SellEntity,
  StockEntity,
} from '../models/api';
import { RequestMethods, SWRKeys, apiGetter, apiMutator } from '../utils';

type MutationResponse<
  S extends (typeof SWRKeys)[keyof typeof SWRKeys],
  T = unknown
> = SWRMutationResponse<
  T,
  any,
  [S, (typeof RequestMethods)[keyof typeof RequestMethods]],
  RequestInit | undefined
>;

interface EntityGetter<T> {
  key: string;
  swr: SWRResponse<T>;
}
interface EntityMutator<S extends (typeof SWRKeys)[keyof typeof SWRKeys], T> {
  key: S;
  swr: MutationResponse<S, T>;
}

export function useProductCategories<T = ProductCategoryEntity[]>(
  query = 'order[0]=name&order[0]=ASC'
): EntityGetter<T> {
  const key = `${SWRKeys.productCategories}?${query}`;
  return { key, swr: useSWR<T>(key, apiGetter<T>()) };
}

export function useMutateProductCategory<T = number>(
  method: (typeof RequestMethods)[keyof typeof RequestMethods]
): EntityMutator<typeof SWRKeys.productCategories, T> {
  return {
    key: SWRKeys.productCategories,
    swr: useSWRMutation(
      [SWRKeys.productCategories, method],
      apiMutator
    ) as MutationResponse<typeof SWRKeys.productCategories, T>,
  };
}

export function useProducts<T = ProductEntity[]>(
  query = 'order[0]=name&order[0]=ASC'
): EntityGetter<T> {
  const key = `${SWRKeys.products}?${query}`;
  return { key, swr: useSWR<T>(key, apiGetter<T>()) };
}

export function useMutateProducts<T = unknown>(
  method: (typeof RequestMethods)[keyof typeof RequestMethods]
): EntityMutator<typeof SWRKeys.products, T> {
  return {
    key: SWRKeys.products,
    swr: useSWRMutation(
      [SWRKeys.products, method],
      apiMutator
    ) as MutationResponse<typeof SWRKeys.products, T>,
  };
}

export function useStocks<T = StockEntity[]>(
  query = 'order[0]=type&order[0]=DESC'
): EntityGetter<T> {
  const key = `${SWRKeys.stocks}?${query}`;
  return { key, swr: useSWR<T>(key, apiGetter<T>()) };
}

export function useMutateStocks<T = unknown>(
  method: (typeof RequestMethods)[keyof typeof RequestMethods]
): EntityMutator<typeof SWRKeys.stocks, T> {
  return {
    key: SWRKeys.stocks,
    swr: useSWRMutation(
      [SWRKeys.stocks, method],
      apiMutator
    ) as MutationResponse<typeof SWRKeys.stocks, T>,
  };
}

export function useSells<T = SellEntity[]>(
  query = 'order[0]=date&order[0]=DESC'
): EntityGetter<T> {
  const key = `${SWRKeys.sells}?${query}`;
  return {
    key,
    swr: useSWR<T>(key, apiGetter<T>(), {
      keepPreviousData: true,
    }),
  };
}

export function useMutateSells<T = unknown>(
  method: (typeof RequestMethods)[keyof typeof RequestMethods]
): EntityMutator<typeof SWRKeys.sells, T> {
  return {
    key: SWRKeys.sells,
    swr: useSWRMutation(
      [SWRKeys.sells, method],
      apiMutator
    ) as MutationResponse<typeof SWRKeys.sells, T>,
  };
}
