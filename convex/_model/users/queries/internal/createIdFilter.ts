import { Expression, FilterBuilder } from 'convex/server';

import { DataModel, Id } from '../../../../_generated/dataModel';

type CreateIdFilterArgs = {
  limitToIds?: Id<'users'>[];
  excludeIds?: Id<'users'>[];
};

export const createIdFilter = (args: CreateIdFilterArgs): ((q: FilterBuilder<DataModel['users']>) => Expression<boolean>) | undefined => {
  // If no filtering is needed, return undefined to skip the filter
  if ((!args.limitToIds || args.limitToIds.length === 0) &&
      (!args.excludeIds || args.excludeIds.length === 0)) {
    return undefined;
  }

  return (q: FilterBuilder<DataModel['users']>): Expression<boolean> => {
    if (args.limitToIds && args.limitToIds.length > 0) {
      const isInLimitList = q.or(...args.limitToIds.map((id) => q.eq(q.field('_id'), id)));
      if (args.excludeIds && args.excludeIds.length > 0) {
        const isNotExcluded = q.not(q.or(...args.excludeIds.map((id) => q.eq(q.field('_id'), id))));
        return q.and(isInLimitList, isNotExcluded);
      }
      return isInLimitList;
    }

    // This branch is only reached when excludeIds is provided but limitToIds is not
    return q.not(q.or(...args.excludeIds!.map((id) => q.eq(q.field('_id'), id))));
  };
};
