import { ReactNode } from 'react';

import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Dialog } from '~/components/generic/Dialog';

export interface CheckInMatchDialogProps {
  children: ReactNode;
  tournamentId?: string;
}

export const CheckInMatchDialog = ({
  children,
  tournamentId,
}: CheckInMatchDialogProps): JSX.Element => (
  <Dialog trigger={children} title="Check In Match Result" description="fooooey">
    <FowV4MatchResultForm tournamentId={tournamentId} />
  </Dialog>
);
