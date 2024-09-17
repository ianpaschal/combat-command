import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { IconButton } from '~/components/generic/IconButton';
import { Stack } from '~/components/generic/Stack';

import './PageWrapper.scss';

export interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  maxWidth?: number | string;
  showBackButton?: boolean;
}

export const PageWrapper = ({
  children,
  title,
  maxWidth,
  showBackButton = false,
}: PageWrapperProps): JSX.Element => {
  const navigate = useNavigate();
  const handleClickBack = (): void => navigate(-1);
  return (
    <div className="PageWrapper" style={{ maxWidth: maxWidth || undefined }}>
      {(showBackButton || title) && (
        <Stack orientation="horizontal" verticalAlign="center" className="PageWrapperHeader">
          {showBackButton && (
            <IconButton onClick={handleClickBack} size="small" variant="outlined">
              <ArrowLeft />
            </IconButton>
          )}
          {title && (
            <h1 className="page-wrapper-title">{title}</h1>
          )}
        </Stack>
      )}
      {children}
    </div>
  );
};