import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Stack } from '~/components/generic/Stack';
import { MAX_WIDTH } from '~/settings';

import './PageWrapper.scss';

export interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  maxWidth?: number | string;
  showBackButton?: boolean;
  appBarPadding?: boolean;
}

export const PageWrapper = ({
  children,
  title,
  appBarPadding = true,
  maxWidth = MAX_WIDTH,
  showBackButton = false,
}: PageWrapperProps): JSX.Element => {
  const navigate = useNavigate();
  const handleClickBack = (): void => navigate(-1);
  return (
    <ScrollArea className={clsx('PageWrapper', { 'PageWrapper-HasAppBar': appBarPadding })}>
      <div className="PageWrapper_Content" style={{ maxWidth }}>
        {(showBackButton || title) && (
          <Stack orientation="horizontal" verticalAlign="center" className="PageWrapper_Header">
            {showBackButton && (
              <Button onClick={handleClickBack} variant="outlined">
                <ArrowLeft />
              </Button>
            )}
            {title && (
              <h1 className="page-wrapper-title">{title}</h1>
            )}
          </Stack>
        )}
        <div className="PageWrapper_Body">
          {children}
        </div>
      </div>
    </ScrollArea >
  );
};