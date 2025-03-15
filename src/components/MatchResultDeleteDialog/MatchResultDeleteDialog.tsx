import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogDescription,
  DialogHeader,
} from '~/components/generic/Dialog';
import { useMatchResult } from '~/components/MatchResultProvider';
import { useDeleteMatchResult } from '~/services/matchResults/useDeleteMatchResult';
import { useMatchResultDeleteDialog } from './MatchResultDeleteDialog.hooks';

import styles from './MatchResultDeleteDialog.module.scss';

export const MatchResultDeleteDialog = (): JSX.Element => {
  const matchResult = useMatchResult();
  const { id, close } = useMatchResultDeleteDialog(matchResult._id);
  const { deleteMatchResult, loading } = useDeleteMatchResult({
    onSuccess: close,
  });
  const handleDelete = () => {
    deleteMatchResult({ id: matchResult._id });
  };
  return (
    <ControlledDialog id={id} className={styles.MatchResultDeleteDialog} disabled={loading} width="small">
      <DialogHeader title="Delete Match Result" onCancel={close} />
      <DialogDescription>
        <p>Are you sure you want to delete this match result?</p>
        <p><strong>This cannot be undone!</strong></p>
      </DialogDescription>
      <DialogActions>
        <Button muted onClick={close} disabled={loading}>Cancel</Button>
        <Button intent="danger" onClick={handleDelete} disabled={loading}>Delete</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
