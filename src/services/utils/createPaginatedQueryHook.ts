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
  loadMore: () => void;
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted' | null;
};

export const createPaginatedQueryHook = <T extends QueryFn>(
  queryFn: T,
): (args: PaginatedQueryArgs<T>, pageSize?: number) => PaginatedQueryHookResult<T> => {
  function isArgs(args: unknown): args is Expand<BetterOmit<FunctionArgs<T>, 'paginationOpts'>> {
    return args !== 'skip' && args !== undefined && args !== null;
  }
  return (args: Omit<T['_args'], 'paginationOpts'> | 'skip', pageSize = DEFAULT_PAGE_SIZE) => {
    const { results: data, isLoading, loadMore, status } = usePaginatedQuery(queryFn, isArgs(args) ? args : 'skip', {
      initialNumItems: pageSize,
    });
    const stored = useRef(data);
    if (data !== undefined) {
      stored.current = data;
    }
    if (!isArgs(args)) {
      return {
        data: undefined,
        loading: false,
        loadMore: () => undefined,
        status: null,
      };
    }
    return {
      data: stored.current,
      loading: isLoading || stored.current === undefined,
      loadMore: () => loadMore(pageSize),
      status,
    };
  };
};
