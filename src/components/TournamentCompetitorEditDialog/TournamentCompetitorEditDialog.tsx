import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { TournamentCompetitorForm, TournamentCompetitorSubmitData } from '~/components/TournamentCompetitorForm';
import { useUpdateTournamentCompetitor } from '~/services/tournamentCompetitors/useUpdateTournamentCompetitor';

import { useTournamentCompetitorEditDialog } from './TournamentCompetitorEditDialog.hooks';

import styles from './TournamentCompetitorEditDialog.module.scss';

const FORM_ID = 'tournament-competitor-edit-form';

export const TournamentCompetitorEditDialog = (): JSX.Element => {
  const { id, data, close } = useTournamentCompetitorEditDialog();
  const {
    mutation: updateTournamentCompetitor,
    loading,
  } = useUpdateTournamentCompetitor({
    onSuccess: close,
  });

  const handleSubmit = (formData: TournamentCompetitorSubmitData): void => {
    if (!data) {
      return;
    }
    updateTournamentCompetitor({
      id: data?.tournamentCompetitor._id,
      ...formData,
    });
  };

  return (
    <ControlledDialog id={id} disabled={loading} width="small">
      <DialogHeader title="Edit Team" onCancel={close} />
      <TournamentCompetitorForm
        id={FORM_ID}
        className={styles.Form}
        tournamentCompetitor={data?.tournamentCompetitor}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <DialogActions>
        <Button variant="secondary" onClick={close} disabled={loading}>Cancel</Button>
        <Button form={FORM_ID} type="submit" disabled={loading}>Save Changes</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
