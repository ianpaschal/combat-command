import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { TournamentCompetitorForm, TournamentCompetitorSubmitData } from '~/components/TournamentCompetitorForm';
import { useCreateTournamentCompetitor } from '~/services/tournamentCompetitors';

import { useTournamentCompetitorCreateDialog } from './TournamentCompetitorCreateDialog.hooks';

import styles from './TournamentCompetitorCreateDialog.module.scss';

const FORM_ID = 'tournament-competitor-create-form';

export const TournamentCompetitorCreateDialog = (): JSX.Element => {
  const { id, close } = useTournamentCompetitorCreateDialog();
  const {
    mutation: createTournamentCompetitor,
    loading,
  } = useCreateTournamentCompetitor({
    onSuccess: close,
  });

  const handleSubmit = (formData: TournamentCompetitorSubmitData): void => {
    createTournamentCompetitor({
      ...formData,
    });
  };

  return (
    <ControlledDialog id={id} disabled={loading} width="small">
      <DialogHeader title="Create Team" onCancel={close} />
      <TournamentCompetitorForm
        id={FORM_ID}
        className={styles.Form}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <DialogActions>
        <Button variant="secondary" onClick={close} disabled={loading}>Cancel</Button>
        <Button form={FORM_ID} type="submit" disabled={loading}>Create</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
