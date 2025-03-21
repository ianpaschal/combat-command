import { Outlet, useLocation } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import clsx from 'clsx';

import { AppBar } from '~/components/AppBar';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { MAX_WIDTH, MIN_WIDTH } from '~/settings';

import styles from './App.module.scss';

export const App = (): JSX.Element => {
  const location = useLocation();
  const width = useWindowWidth();
  if (width < MIN_WIDTH) {
    return (
      <div className={clsx(styles.App, styles['App-minWidthError'])}>
        <h3>Please use a larger device to use CombatCommand.</h3>
        <p>If you are currently using your phone in landscape mode, please turn it to portrait mode.</p>
      </div>
    );
  }
  return (
    <div className={styles.App}>
      <AppBar maxWidth={MAX_WIDTH} />
      <ErrorBoundary key={location.pathname}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};
