import {
  applySupabaseFilters,
  SupabaseFilterColumn,
  SupabaseQuery,
} from '~/services/utils/applySupabaseFilters';

export const getFetcher = <T extends object>(baseQuery: SupabaseQuery) => (
  async (id: string): Promise<T> => {
    const { data, error } = await baseQuery.eq('id', id).single();
    if (error) {
      throw error;
    }
    return data;
  }
);

export const getListFetcher = <T extends object, U extends object>(
  baseQuery: SupabaseQuery,
  paramsColumnMap: Record<keyof T, SupabaseFilterColumn>,
) => (
  async (params?: T): Promise<U[]> => {
    const { data, error } = await applySupabaseFilters(baseQuery, paramsColumnMap, params);
    if (error) {
      throw error;
    }
    return data;
  }
);
