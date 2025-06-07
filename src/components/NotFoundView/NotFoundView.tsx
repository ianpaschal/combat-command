import { Link } from 'react-router-dom';

import styles from './NotFoundView.module.scss';

export const NotFoundView = (): JSX.Element => (
  <div className={styles.NotFoundView}>
    <div className={styles.NotFoundView_Card}>
      <h2>You're lost, soldier!</h2>
      <p>The page you're looking for seems to be missing...</p>
      <Link to="/">Take me back to battalion HQ!</Link>
    </div>
  </div>
);
