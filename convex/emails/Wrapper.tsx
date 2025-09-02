import { ReactNode } from 'react';

import { styles } from './styles';

export interface WrapperProps {
  children: ReactNode;
}

const base64Logo = 'data:image/svg+xml;base64,PHN2ZyBpZD0iXzAiIGRhdGEtbmFtZT0iMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJmaWxsOmJsYWNrOyI+DQo8cGF0aCBkPSJNNywxNS43MTdBNDQsNDQsMCwwLDAsMjAsNi4yMDlhNDQsNDQsMCwwLDAsMTMsOS41MDhWMTEuMjI4QTQwLDQwLDAsMCwxLDIwLDAsNDAsNDAsMCwwLDEsNywxMS4yMjhaIiAvPg0KPHBhdGggZD0iTTcsMTcuOTI1QTQ2LjAxMyw0Ni4wMTMsMCwwLDAsMjAsOS4wNTlhNDYuMDEzLDQ2LjAxMywwLDAsMCwxMyw4Ljg2NnY0LjM1OGE1MCw1MCwwLDAsMS0xMy03Ljg0NkE1MCw1MCwwLDAsMSw3LDIyLjI4M1oiIC8+DQo8cGF0aCBkPSJNNywzMlYyNC40MzlxMi4wMzctLjgsNC0xLjc3MlYzMmE0LDQsMCwwLDAsNCw0SDI1YTQsNCwwLDAsMCw0LTRWMjIuNjY3cTEuOTYyLjk3LDQsMS43NzJWMzJhOCw4LDAsMCwxLTgsOEgxNUE4LDgsMCwwLDEsNywzMloiIC8+DQo8cGF0aCBkPSJNMTgsMjdhMiwyLDAsMSwxLDIsMiwyLDIsMCwwLDEtMi0yWiIgLz4NCjxwYXRoIGQ9Ik0yMi41LDIyLjVhMiwyLDAsMSwxLDIsMiwyLDIsMCwwLDEtMi0yWiIgLz4NCjxwYXRoIGQ9Ik0yMi41LDMxLjVhMiwyLDAsMSwxLDIsMiwyLDIsMCwwLDEtMi0yWiIgLz4NCjxwYXRoIGQ9Ik0xMy41LDMxLjVhMiwyLDAsMSwxLDIsMiwyLDIsMCwwLDEtMi0yWiIgLz4NCjxwYXRoIGQ9Ik0xMy41LDIyLjVhMiwyLDAsMSwxLDIsMiwyLDIsMCwwLDEtMi0yWiIgLz4NCjwvc3ZnPg==';

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
        <img src={base64Logo} width="80" height="80" style={styles.logo} />
        {children}
      </div>
    </body>
  </html>
);
