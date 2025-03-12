import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import clsx from 'clsx';

import { MOBILE_BREAKPOINT } from '~/settings';
import { ElementOrientation, ElementSize } from '~/types/componentLib';

import styles from './NavLinks.module.scss';

export type Visibility = 'main' | 'accountMenu' | 'accountMenuExternal';

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
  wrapper?: (i: number, link: ReactNode) => ReactNode;
}

export const NavLinks = ({
  orientation = 'horizontal',
  size: customSize,
  routes,
  wrapper,
}: NavLinksProps): JSX.Element => {
  const { pathname } = useLocation();
  const width = useWindowWidth();
  const size = customSize || width <= MOBILE_BREAKPOINT ? 'large' : 'normal';
  return (
    <nav className={styles[`Root-${orientation}`]}>
      {routes.map((route, i) => {
        const current = route.path === pathname;
        const classNames = clsx(
          styles.Item,
          size ? {
            [styles[`Item-${size}`]]: true,
          } : undefined,
          {
            [styles['Item-clickable']]: !current,
          },
        );
        if (wrapper) {
          return wrapper(i, (
            <Link
              className={classNames}
              to={route.path}
            >
              {route.title}
              <span className={styles.Indicator} data-state={current ? 'visible' : 'hidden'} />
            </Link>
          ));
        }
        return (
          <Link
            key={i}
            className={classNames}
            to={route.path}
          >
            {route.title}
            <span className={styles.Indicator} data-state={current ? 'visible' : 'hidden'} />
          </Link>
        );
      })}
    </nav>
  );
};
