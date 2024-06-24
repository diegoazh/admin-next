/************************************
 * CONSTANTS
 ************************************/
export const CommonHeaders = {
  'content-type': 'application/json',
};

export const RequestMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const baseUrl = `https://app.starter.io` as const;

export const SWRKeys = {
  products: `${baseUrl}/products`,
  productCategories: `${baseUrl}/product-categories`,
  stocks: `${baseUrl}/stocks`,
  sells: `${baseUrl}/sells`,
} as const;

export const ModalType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  SHOW: 'show',
} as const;
