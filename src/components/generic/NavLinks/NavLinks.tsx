import { ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import clsx from 'clsx';

import { Separator } from '~/components/generic/Separator';
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
  icon?: ReactElement;
}

export interface NavLinksProps {
  orientation?: ElementOrientation;
  routes: NavLink[];
  externalRoutes?: NavLink[];
  size?: ElementSize;
}

export const NavLinks = ({
  orientation = 'horizontal',
  size: customSize,
  routes,
  externalRoutes,
}: NavLinksProps): JSX.Element => {
  const { pathname } = useLocation();
  const width = useWindowWidth();
  const size = customSize || width <= MOBILE_BREAKPOINT ? 'large' : 'normal';
  return (
    <nav className={styles.NavLinks} data-orientation={orientation}>
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
        return (
          <Link
            key={i}
            className={classNames}
            to={route.path}
          >
            {route.icon}
            {route.title}
            <span className={styles.Indicator} data-state={current ? 'visible' : 'hidden'} />
          </Link>
        );
      })}
      {orientation === 'vertical' && (
        <Separator />
      )}
      <div className={styles.ExternalRoutes} data-orientation={orientation}>
        {(externalRoutes ?? []).map((route) => (
          <Link
            key={route.path}
            className={clsx(
              styles.Item,
              styles['Item-clickable'],
              size ? {
                [styles[`Item-${size}`]]: true,
              } : undefined,
            )}
            to={route.path}
            target="_blank"
          >
            {route.icon}
            {route.title}
            <span className={styles.Indicator} />
          </Link>
        ))}
      </div>
    </nav>
  );
};
