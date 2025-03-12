import { ReactNode, useState } from 'react';

// import { TournamentId } from '~/api';
import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Dialog } from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';

import styles from './CheckInMatchDialog.module.scss';

export interface MatchResultEditDialogProps {
  children?: ReactNode;
  trigger?: ReactNode;
  // tournamentId?: TournamentId;
}

export const MatchResultEditDialog = ({
  children,
  trigger,
  // tournamentId,
}: MatchResultEditDialogProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || children}
      title="Edit Match Result"
      actions={[
        { label: 'Cancel', muted: true, onClick: () => setOpen(false), cancel: true },
        { label: 'Check In Match', type: 'submit', form: 'fow-v4-match-result-form' },
      ]}
    >
      <ScrollArea type="scroll" indicatorBorder={['top', 'bottom']}>
        <FowV4MatchResultForm
          id="fow-v4-match-result-form"
          className={styles.Form}
          // tournamentId={tournamentId}
          onSuccess={() => setOpen(false)}
        />
      </ScrollArea>
    </Dialog>
  );
};
