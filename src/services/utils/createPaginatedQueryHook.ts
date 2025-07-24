import { useRef } from 'react';
import { usePaginatedQuery } from 'convex/react';
import {
  BetterOmit,
  Expand,
  FunctionArgs,
  FunctionReference,
} from 'convex/server';

type QueryFn = FunctionReference<'query'>;

export const createPaginatedQueryHook = <T extends QueryFn>(queryFn: T) => {
  function isArgs(args: unknown): args is 'skip' | Expand<BetterOmit<FunctionArgs<T>, 'paginationOpts'>> {
    return args !== 'skip' && args !== undefined && args !== null;
  }
  return (args: Omit<T['_args'], 'paginationOpts'> | 'skip') => {
    if (!isArgs(args)) {
      return {
        data: undefined,
        loading: false,
        loadMore: (_n: number) => undefined,
      };
    }
    const { results: data, isLoading, loadMore } = usePaginatedQuery(queryFn, args, { initialNumItems: 10 });
    const stored = useRef(data);
    if (data !== undefined) {
      stored.current = data;
    }
    return {
      data: stored.current,
      loading: isLoading || stored.current === undefined,
      loadMore,
    };
  };
};
