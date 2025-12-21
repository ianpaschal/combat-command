import { Outlet, useLocation } from 'react-router-dom';
import {
  AppNavigation,
  DialogProvider,
  Route,
} from '@ianpaschal/combat-command-components';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Coffee } from 'lucide-react';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

import { AccountMenu } from '~/components/AccountMenu';
import { usePrimaryAppRoutes } from '~/components/App/App.hooks';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { MAX_WIDTH, MIN_WIDTH_DESKTOP } from '~/settings';

import styles from './App.module.scss';

export const App = (): JSX.Element => {
  const location = useLocation();
  const width = useWindowWidth();
  const primaryRoutes = usePrimaryAppRoutes();
  const secondaryRoutes: Route[] = [
    {
      title: 'Buy Me a Coffee',
      path: 'https://buymeacoffee.com/combatcommand',
      icon: <Coffee />,
    },
  ];
  return (
    <div className={styles.App}>
      <ErrorBoundary key={location.pathname}>
        <AppNavigation
          maxWidth={MAX_WIDTH}
          mobile={width <= MIN_WIDTH_DESKTOP}
          routes={primaryRoutes}
          secondaryControls={<AccountMenu />}
          secondaryRoutes={secondaryRoutes}
        />
        <NuqsAdapter>
          <DialogProvider>
            <Outlet />
          </DialogProvider>
        </NuqsAdapter>
      </ErrorBoundary>
    </div>
  );
};
