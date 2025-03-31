import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

import { FooterBar } from '~/components/FooterBar';
import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { MAX_WIDTH } from '~/settings';

import styles from './PageWrapper.module.scss';

export interface PageWrapperProps {
  footer?: ReactNode;
  children: ReactNode;
  fitToWindow?: boolean;
  maxWidth?: number;
  showBackButton?: boolean;
  title?: string;
  removeAppBarPadding?: boolean;
}

export const PageWrapper = ({
  footer: footerChildren,
  children,
  fitToWindow = false, // WARNING! Can't be used with footer
  maxWidth = MAX_WIDTH,
  showBackButton = false,
  removeAppBarPadding = false,
  title,
}: PageWrapperProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleClickBack = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`${pathname.split('/').slice(0, -1).join('/')}`);
    }
  };
  if (fitToWindow && footerChildren) {
    console.warn('PageWrapper: fitToWindow can\'t be used with footer!');
  }
  return (
    <div className={clsx(styles.PageWrapper, { [styles.AppBarPadding]: !removeAppBarPadding })} data-fitted={fitToWindow}>
      <ScrollArea className={styles.PageWrapper_ScrollArea}>
        <div className={styles.PageWrapper_Content} style={{ maxWidth }}>
          {(showBackButton || title) && (
            <div className={styles.PageWrapper_Header}>
              {showBackButton && (
                <Button onClick={handleClickBack} variant="outlined">
                  <ArrowLeft />
                </Button>
              )}
              {title && (
                <h1>{title}</h1>
              )}
            </div>
          )}
          <div className={styles.PageWrapper_Body}>
            {children}

          </div>
        </div>
      </ScrollArea>
      {footerChildren && (
        <FooterBar maxWidth={maxWidth}>
          {footerChildren}
        </FooterBar>
      )}
    </div>
  );
};
