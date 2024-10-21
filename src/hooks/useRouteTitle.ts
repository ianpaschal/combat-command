import { useLocation } from 'react-router-dom';

import { RouteConfig } from '~/components/generic/NavLinks';
import { routes } from '~/routes';

export const useRouteTitle = (): string | undefined => {
  const { pathname } = useLocation();
  const routeList = routes.reduce((acc, route) => [
    ...acc,
    route,
    ...(route.children?.length ? route.children : []),
  ], [] as RouteConfig[]);
  return routeList.find((route) => route.path === pathname)?.title;
};