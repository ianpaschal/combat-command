import { ReactNode } from 'react';

import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '~/components/generic/Dialog';
import { Drawer } from '~/components/generic/Drawer';

export interface CheckInMatchDialogProps {
  children: ReactNode;
  tournamentId?: string;
}

export const CheckInMatchDialog = ({
  children,
  tournamentId,
}: CheckInMatchDialogProps): JSX.Element => (
  <Dialog>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent title="Check In Match Result">
      {/* <Dialog.Header title="Check-In Match" border side="bottom" />
      <Dialog.Body> */}
      <FowV4MatchResultForm tournamentId={tournamentId} />
      {/* </Dialog.Body> */}
    </DialogContent>
  </Dialog>
);
