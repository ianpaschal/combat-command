import { FowV4MatchResultForm } from '~/components/FowV4MatchResultForm';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { useMatchResult } from '~/components/MatchResultProvider';
import { useMatchResultEditDialog } from './MatchResultEditDialog.hooks';

import styles from './MatchResultEditDialog.module.scss';

export const MatchResultEditDialog = (): JSX.Element => {
  const matchResult = useMatchResult();
  const { id, close } = useMatchResultEditDialog(matchResult._id);
  return (
    <ControlledDialog id={id} className={styles.MatchResultEditDialog}>
      <DialogHeader title="Edit Match Result" onCancel={close} />
      <Separator />
      <ScrollArea type="scroll" indicatorBorders={['top', 'bottom']}>
        <FowV4MatchResultForm
          id="fow-v4-match-result-form"
          matchResultId={matchResult._id}
          className={styles.Form}
          onSuccess={close}
        />
      </ScrollArea>
      <Separator />
      <DialogActions>
        <Button variant="secondary" onClick={close}>Cancel</Button>
        <Button type="submit" form="fow-v4-match-result-form">Save</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
