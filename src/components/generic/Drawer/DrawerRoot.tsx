import {
  ComponentProps,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { Root } from '@radix-ui/react-dialog';

import './DrawerContent.scss';

export interface DrawerRootProps extends ComponentProps<typeof Root> {
  closeOnRouteChange?: boolean;
}

export const DrawerRoot = ({
  children,
  closeOnRouteChange = true,
  ...props
}: DrawerRootProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  useEffect(() => {
    if (closeOnRouteChange) {
      setOpen(false);
    }
  }, [closeOnRouteChange, location.pathname]);
  return (
    <Root {...props} open={open} onOpenChange={setOpen}>
      {children}
    </Root>
  );
};