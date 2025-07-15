import { ReactNode, useEffect } from 'react';
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
  hideTitle?: boolean;
  banner?: ReactNode;
  bannerBackgroundUrl?: string;
}

export const PageWrapper = ({
  footer: footerChildren,
  children,
  fitToWindow = false, // WARNING! Can't be used with footer
  maxWidth = MAX_WIDTH,
  showBackButton = false,
  title,
  hideTitle = false,
  banner,
  bannerBackgroundUrl,
}: PageWrapperProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (title?.length) {
      document.title = `Combat Command | ${title}`;
    }
  }, [title]);

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

  const bannerBackgroundStyle = bannerBackgroundUrl ? {
    backgroundImage: `url(${bannerBackgroundUrl}`,
    backgroundSize: 'cover',
  } : undefined;

  return (
    <div className={clsx(styles.PageWrapper, styles.AppBarPadding)} data-fitted={fitToWindow}>
      <ScrollArea className={styles.PageWrapper_ScrollArea}>
        {banner && (
          <div className={styles.PageWrapper_Banner} style={bannerBackgroundStyle}>
            <div className={styles.PageWrapper_BannerContent} style={{ maxWidth }}>
              {banner}
            </div>
          </div>
        )}
        <div className={styles.PageWrapper_Content} style={{ maxWidth }}>
          {(showBackButton || (title && !hideTitle)) && (
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
