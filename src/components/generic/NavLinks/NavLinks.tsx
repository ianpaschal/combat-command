import { Link } from 'react-router-dom';
import clsx from 'clsx';

import './NavLinks.scss';

export type Visibility = 'main' | 'accountMenu';

export interface RouteConfig {
  visibility: Visibility[];
  path: string;
  element: JSX.Element;
  title: string;
}

export interface NavLink {
  path: string;
  title: string;
}

export interface NavLinksProps {
  orientation?: 'horizontal' | 'vertical';
  routes: NavLink[];
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
    ))}
  </nav>
);