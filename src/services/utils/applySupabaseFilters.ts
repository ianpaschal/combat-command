import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export type SupabaseFilterColumn<RowType> = [keyof RowType, 'equals'|'contains'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseQuery = PostgrestFilterBuilder<any, any, any[]>;

export type FilterColumnMapping<FiltersType, RowType> = Record<keyof FiltersType, SupabaseFilterColumn<RowType>>;

export const applySupabaseFilters = <FiltersType extends object, RowType extends object>(
  query: SupabaseQuery,
  filterColumnMapping: FilterColumnMapping<FiltersType,RowType>,
  filters?: FiltersType,
): SupabaseQuery => {
  if (!filters) {
    return query;
  }
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      const [columnName, operation] = filterColumnMapping[key as keyof FiltersType];
      if (operation === 'contains') {
        query.contains(columnName as string, [value]);
      }
      if (operation === 'equals') {
        query.eq(columnName as string, value);
      }
    }
  });
  return query;
};
