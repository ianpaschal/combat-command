import { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';

import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <div className={styles.ErrorBoundary}>
    <div className={styles.ErrorBoundary_Card}>
      <h2>You're in enemy territory, soldier!</h2>
      <p className="text-gray-700">{error.message}</p>
      <Link to="/">Take me back to battalion HQ!</Link>
    </div>
  </div>
);

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ReactErrorBoundary>
);
