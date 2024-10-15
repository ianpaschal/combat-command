import { ReactNode } from 'react';

import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Dialog } from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';

import styles from './CheckInMatchDialog.module.scss';

export interface CheckInMatchDialogProps {
  children: ReactNode;
  tournamentId?: string;
}

export const CheckInMatchDialog = ({
  children,
  tournamentId,
}: CheckInMatchDialogProps): JSX.Element => (
  <Dialog trigger={children} title="Check In Match Result">
    <ScrollArea type="scroll" indicatorBorder="top">
      <FowV4MatchResultForm className={styles.Form} tournamentId={tournamentId} />
    </ScrollArea>
  </Dialog>
);
