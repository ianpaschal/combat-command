import { cloneElement, ReactElement } from 'react';
import clsx from 'clsx';
import { PaginatedQueryItem } from 'convex/react';

import { Button } from '~/components/generic/Button';
import { PaginatedQueryHookResult, QueryFn } from '~/services/utils/createPaginatedQueryHook';
import { DEFAULT_PAGE_SIZE } from '~/settings';

import styles from './PaginatedList.module.scss';

export interface PaginatedListProps<T extends QueryFn> {
  className?: string;
  query: PaginatedQueryHookResult<T>;
  render: (result?: PaginatedQueryItem<T>) => ReactElement;
  loadMoreSize?: number;
  emptyState?: ReactElement;
}

export const PaginatedList = <T extends QueryFn>({
  className,
  query,
  render,
  emptyState,
  loadMoreSize = DEFAULT_PAGE_SIZE,
}: PaginatedListProps<T>): JSX.Element => {
  const results = query.status === 'LoadingFirstPage' ? Array.from({
    length: DEFAULT_PAGE_SIZE,
  }).map(() => undefined) : (query.data ?? []);
  return (
    <div className={clsx(styles.PaginatedList, className)}>
      {results.map((r, i) => {
        const element = render(r);
        return cloneElement(element, {
          key: i,
          className: clsx(element.props.className, styles.PaginatedList_Item),
        });
      })}
      {query.status === 'Exhausted' && !query.data?.length && (
        emptyState
      )}
      {query.status && ['CanLoadMore', 'LoadingMore'].includes(query.status) && (
        <Button text="Load More"
          loading={query.status === 'LoadingMore'}
          disabled={query.status === 'LoadingMore'}
          onClick={() => query.loadMore(loadMoreSize)}
        />
      )}
    </div>
  );
};
