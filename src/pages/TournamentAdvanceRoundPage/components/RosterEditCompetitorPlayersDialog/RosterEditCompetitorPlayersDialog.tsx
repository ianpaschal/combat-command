import { TournamentCompetitor } from '~/api';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { SubstitutePlayerForm, SubstitutePlayerFormData } from '~/pages/TournamentAdvanceRoundPage/components/TournamentCompetitorSubstitutePlayerForm';
import { useSubstituteTournamentCompetitorPlayer } from '~/services/tournamentCompetitors/useSubstituteTournamentCompetitorPlayer';
import { useRosterEditCompetitorPlayersDialog } from './RosterEditCompetitorPlayersDialog.hooks';

import styles from './RosterEditCompetitorPlayersDialog.module.scss';

const FORM_ID = 'tournament-competitor-substitute-player-form';

export interface RosterEditCompetitorPlayersDialogProps {
  competitor: TournamentCompetitor;
}

export const RosterEditCompetitorPlayersDialog = (): JSX.Element => {
  const { id, data, close } = useRosterEditCompetitorPlayersDialog();
  const {
    mutation: substituteTournamentCompetitorPlayer,
    loading,
  } = useSubstituteTournamentCompetitorPlayer({
    onSuccess: close,
  });

  const handleSubmit = (formData: SubstitutePlayerFormData): void => {
    if (!data) {
      return;
    }
    substituteTournamentCompetitorPlayer({
      tournamentCompetitorId: data.competitor._id,
      ...formData,
    });
  };

  return (
    <ControlledDialog id={id} disabled={loading} width="small">
      <DialogHeader title="Substitute Player" onCancel={close} />
      <SubstitutePlayerForm
        id={FORM_ID}
        className={styles.Form}
        competitor={data?.competitor}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <DialogActions>
        <Button variant="secondary" onClick={close} disabled={loading}>Cancel</Button>
        <Button form={FORM_ID} type="submit" disabled={loading}>Substitute</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
