import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

// function isReferencedColumn(value: unknown): value is { columns: string[], foreignTable: string } {
//   return typeof value === 'object' && value !== null && 'foreignTable' in value;
// }

export type SupabaseFilterColumn = string | string[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseQuery = PostgrestFilterBuilder<any, any, any[]>;

type FilterColumnMapping<T> = Record<keyof T, SupabaseFilterColumn>;

export const applySupabaseFilters = <T extends object>(
  query: SupabaseQuery,
  filterColumnMapping: FilterColumnMapping<T>,
  filters?: T,
): SupabaseQuery => {
  if (!filters) {
    return query;
  }
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      const column = filterColumnMapping[key as keyof T];

      const isMultiColumn = Array.isArray(column);
      const isMultiValue = Array.isArray(value);

      // If filtering for one of several possible values on a column
      if (!isMultiColumn && isMultiValue) {
        query.in(column, value);
      }

      // If filtering for a single value on multiple columns
      if (isMultiColumn && !isMultiValue) {
        query.or(column.map((name) => `${name}.eq.${value}`).join(','));
      }

      // If filtering for a single value on a single column
      if (!isMultiColumn && !isMultiValue) {
        query.eq(column, value);
      }
    }
  });
  return query;
};
