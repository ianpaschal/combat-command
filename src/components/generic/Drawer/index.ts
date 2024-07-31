import { Close, Trigger } from '@radix-ui/react-dialog';

import { DrawerBody } from './DrawerBody';
import { DrawerContent } from './DrawerContent';
import { DrawerHeader } from './DrawerHeader';
import { DrawerRoot } from './DrawerRoot';

export const Drawer = {
  Header: DrawerHeader,
  Root: DrawerRoot,
  Body: DrawerBody,
  Trigger,
  Content: DrawerContent,
  Close,
};