import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Stack } from '~/components/generic/Stack';

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
  maxWidth,
  showBackButton = false,
}: PageWrapperProps): JSX.Element => {
  const navigate = useNavigate();
  const handleClickBack = (): void => navigate(-1);
  return (
    <ScrollArea className={clsx('PageWrapper', { 'PageWrapper--HasAppBar': appBarPadding })}>
      {(showBackButton || title) && (
        <Stack orientation="horizontal" verticalAlign="center" className="PageWrapper__Header">
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
      <div className="PageWrapper__Body">
        {children}
      </div>
    </ScrollArea>
  );
};