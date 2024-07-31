import { ReactNode } from 'react';

import './PageWrapper.scss';

export interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  maxWidth?: number | string;
}

export const PageWrapper = ({
  children,
  title,
  maxWidth,
}: PageWrapperProps): JSX.Element => (
  <div className="PageWrapper" style={{ maxWidth: maxWidth || undefined }}>
    {title && (
      <h1 className="page-wrapper-title">{title}</h1>
    )}
    {children}
  </div>
);