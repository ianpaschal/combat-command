import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export type SupabaseFilterColumn = [string|string[], 'equals'|'contains'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseQuery = PostgrestFilterBuilder<any, any, any>;

export type FilterColumnMapping<FiltersType> = Record<keyof FiltersType, SupabaseFilterColumn>;

export const applySupabaseFilters = <FiltersType extends object>(
  query: SupabaseQuery,
  filterColumnMapping: FilterColumnMapping<FiltersType>,
  filters?: FiltersType,
) => {
  if (!filters) {
    return query;
  }
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      const [columnName, operation] = filterColumnMapping[key as keyof FiltersType];
      if (Array.isArray(columnName)) {
        if (operation === 'equals') {
          // Convert each column name to ->> and join together with commas
          query.or(columnName.map((c) => `${c.split('.').join('->>')}.eq.${value}`).join(','));
        }
      } else {
        if (operation === 'contains') {
          query.contains(columnName as string, [value]);
        }
        if (operation === 'equals') {
          const selector = columnName.split('.').join('->>');
          query.eq(selector as string, value);
        }
      }
    }
  });
  return query;
};
