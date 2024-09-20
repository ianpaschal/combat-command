import { ReactNode } from 'react';

import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Drawer } from '~/components/generic/Drawer';

export interface CheckInMatchDialogProps {
  children: ReactNode;
  tournamentId?: string;
}

export const CheckInMatchDialog = ({
  children,
  tournamentId,
}: CheckInMatchDialogProps): JSX.Element => (
  <Drawer.Root>
    <Drawer.Trigger asChild>
      {children}
    </Drawer.Trigger>
    <Drawer.Content side="bottom">
      <Drawer.Header title="Check-In Match" border side="bottom" />
      <Drawer.Body>
        <FowV4MatchResultForm tournamentId={tournamentId} />
      </Drawer.Body>
    </Drawer.Content>
  </Drawer.Root>
);
