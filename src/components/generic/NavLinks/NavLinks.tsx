import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import './NavLinks.scss';

export interface RouteConfig {
  icon?: ReactNode;
  title: string;
  path: string;
  subRoutes?: RouteConfig[];
  hidden?: boolean;
  element: ReactNode;
}

export interface NavLinksProps {
  orientation?: 'horizontal' | 'vertical';
  routes: RouteConfig[];
}

export const NavLinks = ({
  orientation = 'horizontal',
  routes,
}: NavLinksProps): JSX.Element => (
  <nav className={clsx('NavLinksRoot', `NavLinksRoot-${orientation}`)}>
    {routes.map((route, i) => (
      <Link key={i} to={route.path} className="NavLinksItem">
        {route.title}
      </Link>
    ),
    )}
  </nav>
);