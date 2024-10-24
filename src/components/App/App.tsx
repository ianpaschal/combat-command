import { Outlet } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';

import { AppBar } from '~/components/AppBar';
import { useAuth } from '~/components/AuthProvider';
import { getNavLinksByVisibility } from '~/routes';
import { MAX_WIDTH, MIN_WIDTH } from '~/settings';

import './App.scss';

export const App = (): JSX.Element => {
  const user = useAuth();
  const links = getNavLinksByVisibility('main');
  const width = useWindowWidth();
  if (width < MIN_WIDTH) {
    return (
      <div className="App">
        <p>Please use a larger device to use CombatCommand. If you are currently using your phone in landscape mode, please turn it to portrait mode.</p>
      </div>
    );
  }
  return (
    <div className="App">
      {user && (
        <AppBar navItems={links} maxWidth={MAX_WIDTH} />
      )}
      <Outlet />
    </div>
  );
};