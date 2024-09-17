import { useLocation } from 'react-router-dom';

import { AppBar } from '~/components/AppBar';
import { AppRoutes } from '~/components/AppRoutes';
import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { routes } from '~/routes';

import './App.scss';

const checkInMatchPath = '/matches/check-in';

export const App = (): JSX.Element => {
  const user = useAuth();
  const { pathname } = useLocation();
  return (
    <div className="App">
      {user && (
        <AppBar routes={routes} />
      )}
      <AppRoutes routes={routes} />
      {user && pathname !== checkInMatchPath && (
        <CheckInMatchDialog />
      )}
    </div >
  );
};