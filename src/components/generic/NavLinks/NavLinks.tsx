import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { bem } from '~/utils/componentLib/bem';

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

const cn = bem('NavLinks');

export const NavLinks = ({
  orientation = 'horizontal',
  routes,
}: NavLinksProps): JSX.Element => (
  <nav className={clsx(cn('Root', { [orientation]: true }))}>
    {routes.map((route, i) => (
      <Link key={i} to={route.path} className={cn('Item')}>
        {route.title}
      </Link>
    ))}
  </nav>
);