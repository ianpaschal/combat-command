import { applySupabaseFilters, SupabaseFilterColumn } from '~/services/utils/applySupabaseFilters';
import { supabase } from '~/supabaseClient';

/**
 * T - the Row type
 * @param baseQuery 
 * @returns 
 */
export const getFetcher = <Row extends object>(tableName: string) => (
  async (id: string): Promise<Row> => {
    const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
    if (error) {
      throw error;
    }
    return data;
  }
);

/**
 * 
 * @param baseQuery 
 * @param paramsColumnMap 
 * @returns 
 * 
 * T - the params type
 * U - the row type
 */
export const getListFetcher = <T extends object, U extends object>(
  tableName: string,
  paramsColumnMap: Record<keyof T, SupabaseFilterColumn<U>>,
) => (
  async (params?: T): Promise<U[]> => {
    const baseQuery = supabase.from(tableName).select('*');
    const { data, error } = await applySupabaseFilters(baseQuery, paramsColumnMap, params);
    if (error) {
      throw error;
    }
    return data;
  }
);
