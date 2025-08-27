import { ReactNode } from 'react';

import { AppLogo } from './AppLogo';
import { styles } from './styles';

export interface WrapperProps {
  children: ReactNode;
}

export const Wrapper = ({
  children,
}: WrapperProps): JSX.Element => (
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap" rel="stylesheet" />
    </head>
    <body style={styles.body}>
      <div style={styles.wrapper}>
        <AppLogo />
        {children}
      </div>
    </body>
  </html>
);
