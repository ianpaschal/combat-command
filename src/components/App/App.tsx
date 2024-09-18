import { Outlet, useLocation } from 'react-router-dom';

import { AppBar } from '~/components/AppBar';
import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { getNavLinks } from '~/routes';

// import { routes } from '~/routes';
import './App.scss';

const checkInMatchPath = '/matches/check-in';

export const App = (): JSX.Element => {
  const user = useAuth();
  const { pathname } = useLocation();
  const links = getNavLinks('main');
  return (
    <div className="App">
      {user && (
        <AppBar navItems={links} />
      )}
      <Outlet />
      {user && pathname !== checkInMatchPath && (
        <CheckInMatchDialog />
      )}
    </div >
  );
};