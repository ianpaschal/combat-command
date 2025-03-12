import { ReactNode } from 'react';

import styles from './DialogActions.module.scss';

export interface DialogActionsProps {
  children: ReactNode;
}

export const DialogActions = ({
  children,
}: DialogActionsProps): JSX.Element => (
  <div className={styles.Root}>
    {children}
  </div>
);
