import { ReactNode, useState } from 'react';

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
}: CheckInMatchDialogProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title="Check In Match Result"
      actions={[
        { label: 'Cancel', muted: true, onClick: () => setOpen(false), cancel: true },
        { label: 'Check In Match', type: 'submit', form: 'fow-v4-match-result-form' },
      ]}
    >
      <ScrollArea type="scroll" indicatorBorder="top">
        <FowV4MatchResultForm
          id="fow-v4-match-result-form"
          className={styles.Form}
          tournamentId={tournamentId}
          onSuccess={() => setOpen(false)}
        />
      </ScrollArea>
    </Dialog>
  );
};