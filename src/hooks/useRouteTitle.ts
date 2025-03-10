import { useLocation } from 'react-router-dom';

import { getRouteTitles, routes } from '~/routes';

export const useRouteTitle = (): string | undefined => {
  const { pathname } = useLocation();
  const routeList = getRouteTitles(routes);
  return routeList.find((route) => route.path === pathname)?.title;
};
