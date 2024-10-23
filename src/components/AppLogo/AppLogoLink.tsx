import { Link } from 'react-router-dom';

import { AppLogo } from './AppLogo';

import styles from './AppLogoLink.module.scss';

export const AppLogoLink = () => (
  <Link className={styles.Link} to="/">
    <AppLogo className={styles.Logo} />
    <div className={styles.Name}>Combat Command</div>
  </Link>
);