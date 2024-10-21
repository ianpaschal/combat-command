import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import { ElementOrientation, ElementSize } from '~/types/componentLib';
import { bem } from '~/utils/componentLib/bem';

import './NavLinks.scss';

export type Visibility = 'main' | 'accountMenu';

export interface RouteConfig {
  index?: boolean;
  visibility?: Visibility[];
  path?: string;
  element: JSX.Element;
  title?: string;
  children?: RouteConfig[];
}

export interface NavLink {
  path: string;
  title: string;
}

export interface NavLinksProps {
  orientation?: ElementOrientation;
  routes: NavLink[];
  size?: ElementSize;
  wrapper?: (link: ReactNode) => ReactNode;
}

const cn = bem('NavLinks');

export const NavLinks = ({
  orientation = 'horizontal',
  size = 'normal',
  routes,
  wrapper,
}: NavLinksProps): JSX.Element => {
  const { pathname } = useLocation();
  return (
    <nav className={clsx(cn('Root', { [orientation]: true }))}>
      {routes.map((route, i) => {
        const current = route.path === pathname;
        if (wrapper) {
          return wrapper(
            <Link key={i} to={route.path} className={cn('Item', { [size]: true, clickable: !current })}>
              {route.title}
              <span className="NavLinks_Indicator" data-state={current ? 'visible' : 'hidden'} />
            </Link>,
          );
        }
        return (
          <Link key={i} to={route.path} className={cn('Item', { [size]: true, clickable: !current })}>
            {route.title}
            <span className="NavLinks_Indicator" data-state={current ? 'visible' : 'hidden'} />
          </Link>
        );
      })}
    </nav>
  );
};