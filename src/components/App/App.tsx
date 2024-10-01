import { Outlet } from 'react-router-dom';

import { AppBar } from '~/components/AppBar';
import { useAuth } from '~/components/AuthProvider';
import { getNavLinks } from '~/routes';
import { MAX_WIDTH } from '~/settings';

import './App.scss';

export const App = (): JSX.Element => {
  const user = useAuth();
  const links = getNavLinks('main');
  return (
    <div className="App">
      {user && (
        <AppBar navItems={links} maxWidth={MAX_WIDTH} />
      )}
      <Outlet />
    </div >
  );
};