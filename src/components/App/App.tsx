import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { AppBar } from '~/components/AppBar';
import { AppRoutes } from '~/components/AppRoutes';
import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { routes } from '~/routes';

import './App.scss';

const checkInMatchPath = '/matches/check-in';

export const App = (): JSX.Element => {
  const user = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleClickCheckInMatch = () => {
    navigate(checkInMatchPath);
  };
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