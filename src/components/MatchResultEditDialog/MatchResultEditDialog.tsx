import { useState } from 'react';

import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { MatchResultForm } from '~/components/MatchResultForm';
import { useMatchResult } from '~/components/MatchResultProvider';
import { useMatchResultEditDialog } from './MatchResultEditDialog.hooks';

import styles from './MatchResultEditDialog.module.scss';

export const MatchResultEditDialog = (): JSX.Element => {
  const matchResult = useMatchResult();
  const { id, close } = useMatchResultEditDialog(matchResult._id);
  const [actionsDisabled, setActionsDisabled] = useState<boolean>(false);
  return (
    <ControlledDialog id={id} className={styles.MatchResultEditDialog}>
      <DialogHeader title="Edit Match Result" onCancel={close} />
      <Separator />
      <ScrollArea
        className={styles.MatchResultEditDialog_ScrollArea}
        indicators={{ top: { border: true }, bottom: { border: true } }}
        type="scroll"
      >
        <MatchResultForm
          id="fow-v4-match-result-form"
          matchResult={matchResult}
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
