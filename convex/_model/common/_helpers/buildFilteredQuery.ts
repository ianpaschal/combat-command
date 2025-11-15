import {
  DocumentByInfo,
  OrderedQuery,
  QueryInitializer,
} from 'convex/server';
import { filter } from 'convex-helpers/server/filter';

import { DataModel } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export type FilterValue = string | number | boolean | null;

export type FilterConfig<T extends keyof DataModel> = {
  table: T;
  filterIndex: Extract<keyof DataModel[T]['indexes'], string>;
  searchIndex: Extract<keyof DataModel[T]['searchIndexes'], string>;
};

export type Filters<T extends keyof DataModel> = Partial<Record<keyof DataModel[T]['document'], FilterValue | FilterValue[] | undefined>> & {
  search?: string;
  order?: 'asc' | 'desc';
};

export function buildFilteredQuery<T extends keyof DataModel>(
  ctx: QueryCtx,
  config: FilterConfig<T>,
  filters?: Filters<T>,
): OrderedQuery<DataModel[T]> {
  const baseQuery: QueryInitializer<DataModel[T]> = ctx.db.query(config.table);

  if (!filters) {
    return baseQuery.withIndex(config.filterIndex);
  }

  const { search, order, ...restFilters } = filters;

  const applyFilters = (r: DocumentByInfo<DataModel[T]>): boolean => {
    for (const [field, value] of Object.entries(restFilters)) {
      if (!value) {
        continue;
      }
      if (Array.isArray(value)) {
        if (!value.includes(r[field])) {
          return false;
        }
      } else {
        if (r[field] !== value) {
          return false;
        }
      }
      const values = Array.isArray(value) ? value : [value];
      if (values.length === 0) {
        continue;
      }
    }
    return true;
  };

  // Search indexes apply ordering, so handle them first:
  if (search) {
    return filter(baseQuery.withSearchIndex(config.searchIndex, (q) => (
      q.search(config.searchIndex, search)
    )), applyFilters);
  }

  // Otherwise, use the filter index, apply filters, then order:
  return filter(baseQuery.withIndex(config.filterIndex), applyFilters).order(order ?? 'asc');
}
