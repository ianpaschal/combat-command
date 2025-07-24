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

export const MatchResultCreateDialog = (): JSX.Element => {
  const { id, close } = useMatchResultCreateDialog();
  return (
    <ControlledDialog id={id} className={styles.MatchResultCreateDialog}>
      <DialogHeader title="Create Match Result" onCancel={close} />
      <Separator />
      <ScrollArea type="scroll" indicatorBorders={['top', 'bottom']}>
        <FowV4MatchResultForm
          id="fow-v4-match-result-form"
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
