import { Outlet } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';

import { AppBar } from '~/components/AppBar';
import { MAX_WIDTH, MIN_WIDTH } from '~/settings';

import styles from './App.module.scss';

export const App = (): JSX.Element => {
  const width = useWindowWidth();
  if (width < MIN_WIDTH) {
    return (
      <div className={styles.Root}>
        <p>Please use a larger device to use CombatCommand. If you are currently using your phone in landscape mode, please turn it to portrait mode.</p>
      </div>
    );
  }
  return (
    <div className={styles.Root}>
      <AppBar maxWidth={MAX_WIDTH} />
      <Outlet />
    </div>
  );
};
