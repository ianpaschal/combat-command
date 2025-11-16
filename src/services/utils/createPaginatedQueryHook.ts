import { useRef } from 'react';
import { PaginatedQueryItem, usePaginatedQuery } from 'convex/react';
import {
  BetterOmit,
  Expand,
  FunctionArgs,
  FunctionReference,
} from 'convex/server';

import { DEFAULT_PAGE_SIZE } from '~/settings';

export type QueryFn = FunctionReference<'query'>;

export type PaginatedQueryArgs<T extends QueryFn> = Omit<T['_args'], 'paginationOpts'> | 'skip';

export type PaginatedQueryHookResult<T extends QueryFn> = {
  data?: PaginatedQueryItem<T>[];
  loading: boolean;
  loadMore: (n: number) => void;
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted' | null;
};

export const createPaginatedQueryHook = <T extends QueryFn>(
  queryFn: T,
): (args: PaginatedQueryArgs<T>) => PaginatedQueryHookResult<T> => {
  function isArgs(args: unknown): args is Expand<BetterOmit<FunctionArgs<T>, 'paginationOpts'>> {
    return args !== 'skip' && args !== undefined && args !== null;
  }
  return (args: PaginatedQueryArgs<T>) => {
    if (!isArgs(args)) {
      return {
        data: undefined,
        loading: false,
        loadMore: (_n: number) => undefined,
        status: null,
      };
    }
    const { results: data, isLoading, loadMore, status } = usePaginatedQuery(queryFn, args, {
      initialNumItems: args.paginationOpts?.numItems ?? DEFAULT_PAGE_SIZE,
    });
    const stored = useRef(data);
    if (data !== undefined) {
      stored.current = data;
    }
    return {
      data: stored.current,
      loading: isLoading || stored.current === undefined,
      loadMore,
      status,
    };
  };
};
