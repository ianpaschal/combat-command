import { useRef } from 'react';
import { useQuery } from 'convex/react';
import { FunctionReference } from 'convex/server';

type QueryFn = FunctionReference<'query'>;

export const createQueryHook = <T extends QueryFn>(queryFn: T) => (args: T['_args'] | 'skip') => {
  const data = useQuery(queryFn, args);
  const stored = useRef(data);
  if (data !== undefined) {
    stored.current = data;
  }
  return {
    data: stored.current,
    loading: stored.current === undefined,
  };
};
