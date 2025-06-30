import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { TournamentCompetitorForm, TournamentCompetitorSubmitData } from '~/components/TournamentCompetitorForm';
import { useUpdateTournamentCompetitor } from '~/services/tournamentCompetitors';
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

    const { players, ...restData } = formData;
    updateTournamentCompetitor({
      id: data?.tournamentCompetitor._id,
      ...restData,
      players: players.filter((player) => player.userId),
    });
  };

  return (
    <ControlledDialog id={id} disabled={loading} width="small">
      <DialogHeader title="Edit Team" onCancel={close} />
      <ScrollArea>
        <TournamentCompetitorForm
          id={FORM_ID}
          className={styles.Form}
          tournamentCompetitor={data?.tournamentCompetitor}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </ScrollArea>
      <DialogActions>
        <Button variant="secondary" onClick={close} disabled={loading}>Cancel</Button>
        <Button form={FORM_ID} type="submit" disabled={loading}>Save Changes</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
