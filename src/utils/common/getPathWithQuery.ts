import qs from 'qs';

export const getPathWithQuery = (basePath: string, params: unknown): string => {
  const queryString = qs.stringify(params, {
    arrayFormat: 'comma',
  });
  return `${basePath}?${queryString}`;
};
