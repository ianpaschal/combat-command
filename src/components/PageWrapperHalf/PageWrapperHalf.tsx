import { ReactNode } from 'react';

import { AppLogoLink } from '~/components/AppLogo';
import { ScrollArea } from '~/components/generic/ScrollArea';

import styles from './PageWrapperHalf.module.scss';

export interface PageWrapperHalfProps {
  children: ReactNode;
}

export const PageWrapperHalf = ({
  children,
}: PageWrapperHalfProps): JSX.Element => (
  <div className={styles.Root}>
    <div className={styles.Pane}>
      <div className={styles.Header}>
        <AppLogoLink />
      </div>
      <ScrollArea>
        <div className={styles.Body}>
          {children}
        </div>
      </ScrollArea>
    </div>
  </div>
);