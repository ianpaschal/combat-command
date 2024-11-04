import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { bem } from '~/utils/componentLib/bem';

import './PageWrapper.scss';

export interface PageWrapperProps {
  appBarPadding?: boolean;
  children: ReactNode;
  fitToWindow?: boolean;
  maxWidth?: number | string;
  showBackButton?: boolean;
  title?: string;
}

const cn = bem('PageWrapper');

export const PageWrapper = ({
  appBarPadding = true,
  children,
  fitToWindow = false,
  maxWidth,
  showBackButton = false,
  title,
}: PageWrapperProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleClickBack = (): void => navigate(`${pathname.split('/').slice(0, -1).join('/')}`);
  return (
    <ScrollArea className={clsx(cn(), { 'PageWrapper-hasAppBar': appBarPadding })}>
      <div className={cn('Content', { fitToWindow })} style={{ maxWidth }}>
        {(showBackButton || title) && (
          <div className={cn('Header')}>
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
        <div className={cn('Body', { fitToWindow })}>
          {children}
        </div>
      </div>
    </ScrollArea >
  );
};