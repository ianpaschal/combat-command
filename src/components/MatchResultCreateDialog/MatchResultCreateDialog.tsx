import { useState } from 'react';

import { TournamentPairingId } from '~/api';
import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { useMatchResultCreateDialog } from './MatchResultCreateDialog.hooks';

import styles from './MatchResultCreateDialog.module.scss';

export interface MatchResultCreateDialogProps {
  tournamentPairingId?: TournamentPairingId;
}

export const MatchResultCreateDialog = ({
  tournamentPairingId,
}: MatchResultCreateDialogProps): JSX.Element => {
  const { id, close, data } = useMatchResultCreateDialog();
  const [actionsDisabled, setActionsDisabled] = useState<boolean>(false);
  return (
    <ControlledDialog id={id} className={styles.MatchResultCreateDialog}>
      <DialogHeader title="Check-In Match Result" onCancel={close} />
      <Separator />
      <ScrollArea type="scroll" indicatorBorders={['top', 'bottom']}>
        <FowV4MatchResultForm
          id="fow-v4-match-result-form"
          tournamentPairingId={tournamentPairingId ?? data?.tournamentPairingId}
          className={styles.Form}
          onSuccess={close}
          onStatusChange={({ disabled }) => setActionsDisabled(disabled)}
        />
      </ScrollArea>
      <Separator />
      <DialogActions>
        <Button
          disabled={actionsDisabled}
          text="Cancel"
          variant="secondary"
          onClick={close}
        />
        <Button
          disabled={actionsDisabled}
          form="fow-v4-match-result-form"
          text="Save"
          type="submit"
        />
      </DialogActions>
    </ControlledDialog>
  );
};
