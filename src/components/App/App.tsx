import { Outlet, useLocation } from 'react-router-dom';

import { AppBar } from '~/components/AppBar';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { MAX_WIDTH } from '~/settings';

import styles from './App.module.scss';

export const App = (): JSX.Element => {
  const location = useLocation();
  return (
    <div className={styles.App}>
      <AppBar maxWidth={MAX_WIDTH} />
      <ErrorBoundary key={location.pathname}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};
