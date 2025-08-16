import { UserId } from '~/api';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { TournamentCompetitorForm, TournamentCompetitorSubmitData } from '~/components/TournamentCompetitorForm';
import { useCreateTournamentCompetitor, useUpdateTournamentCompetitor } from '~/services/tournamentCompetitors';
import { useTournamentCompetitorEditDialog } from './TournamentCompetitorEditDialog.hooks';

import styles from './TournamentCompetitorEditDialog.module.scss';

const FORM_ID = 'tournament-competitor-edit-form';

export const TournamentCompetitorEditDialog = (): JSX.Element => {
  const { id, data, close } = useTournamentCompetitorEditDialog();
  const {
    mutation: createTournamentCompetitor,
    loading: createTournamentCompetitorLoading,
  } = useCreateTournamentCompetitor({
    onSuccess: close,
  });
  const {
    mutation: updateTournamentCompetitor,
    loading: updateTournamentCompetitorLoading,
  } = useUpdateTournamentCompetitor({
    onSuccess: close,
  });

  const handleSubmit = ({ addedPlayers, ...restFormData }: TournamentCompetitorSubmitData): void => {
    const id = data?.tournamentCompetitor._id;
    const isUserId = (id: UserId | undefined): id is UserId => id !== undefined && id.length > 0;
    if (id) {
      updateTournamentCompetitor({
        id: id,
        playerUserIds: addedPlayers.map((p) => p.userId).filter(isUserId),
        ...restFormData,
      });
    } else {
      createTournamentCompetitor({
        playerUserIds: addedPlayers.map((p) => p.userId).filter(isUserId),
        ...restFormData,
      });
    }
  };

  const loading = createTournamentCompetitorLoading || updateTournamentCompetitorLoading;

  return (
    <ControlledDialog id={id} disabled={loading} width="small">
      <DialogHeader title="Edit Team" onCancel={close} />
      <Separator />
      <ScrollArea>
        <TournamentCompetitorForm
          id={FORM_ID}
          className={styles.Form}
          tournamentCompetitor={data?.tournamentCompetitor}
          onSubmit={handleSubmit}
          disabled={loading}
        />
      </ScrollArea>
      <Separator />
      <DialogActions>
        <Button variant="secondary" onClick={close} disabled={loading}>Done</Button>
        <Button form={FORM_ID} type="submit" disabled={loading}>Save Changes</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
