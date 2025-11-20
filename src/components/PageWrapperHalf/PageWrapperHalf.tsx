import { ReactNode } from 'react';

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
      <ScrollArea>
        <div className={styles.Body}>
          {children}
        </div>
      </ScrollArea>
    </div>
  </div>
);
