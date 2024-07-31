import { Plus } from 'lucide-react';

import { FloatingActionButton } from '~/components/FloatingActionButton';
import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Drawer } from '~/components/generic/Drawer';

export const CheckInMatchDialog = (): JSX.Element => (
  <Drawer.Root>
    <Drawer.Trigger asChild>
      <FloatingActionButton>
        <Plus />
      </FloatingActionButton>
    </Drawer.Trigger>
    <Drawer.Content side="bottom">
      <Drawer.Header title="Check-In Match" border side="bottom" />
      <Drawer.Body>
        <FowV4MatchResultForm />
      </Drawer.Body>
    </Drawer.Content>
  </Drawer.Root>
);
