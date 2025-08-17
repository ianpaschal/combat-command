import { MouseEvent } from 'react';

import { TournamentCompetitor } from '~/api';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { TournamentCompetitorForm, TournamentCompetitorSubmitData } from '~/components/TournamentCompetitorForm';
import { useCreateTournamentCompetitor, useUpdateTournamentCompetitor } from '~/services/tournamentCompetitors';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';
import { useTournamentCompetitorEditDialog } from './TournamentCompetitorEditDialog.hooks';

import styles from './TournamentCompetitorEditDialog.module.scss';

const FORM_ID = 'tournament-competitor-edit-form';

export interface TournamentCompetitorEditDialogProps {
  competitor?: TournamentCompetitor | null;
}

export const TournamentCompetitorEditDialog = ({
  competitor,
}: TournamentCompetitorEditDialogProps): JSX.Element => {
  const { id: dialogId, close } = useTournamentCompetitorEditDialog(competitor?._id);
  const {
    mutation: createTournamentCompetitor,
    loading: createTournamentCompetitorLoading,
  } = useCreateTournamentCompetitor({
    onSuccess: () => {
      close();
    },
  });
  const {
    mutation: updateTournamentCompetitor,
    loading: updateTournamentCompetitorLoading,
  } = useUpdateTournamentCompetitor({
    onSuccess: () => {
      close();
    },
  });

  const handleCancel = (e: MouseEvent): void => {
    e.stopPropagation();
    close();
  };

  const handleSubmit = ({ captain, ...restFormData }: TournamentCompetitorSubmitData): void => {
    if (competitor) {
      updateTournamentCompetitor({
        id: competitor._id,
        ...restFormData,
      });
    } else {
      createTournamentCompetitor({
        captainUserId: captain.userId!, // Already validated in form
        ...restFormData,
      });
    }
  };

  const loading = createTournamentCompetitorLoading || updateTournamentCompetitorLoading;

  const title = competitor ? `Edit Team ${getTournamentCompetitorDisplayName(competitor)}` : 'Create Team';
  const submitLabel = competitor ? 'Save Changes' : 'Create';

  return (
    <ControlledDialog id={dialogId} disabled={loading} width="small">
      <DialogHeader title={title} onCancel={handleCancel} />
      <ScrollArea>
        <TournamentCompetitorForm
          id={FORM_ID}
          className={styles.Form}
          tournamentCompetitor={competitor}
          onSubmit={handleSubmit}
          disabled={loading}
        />
      </ScrollArea>
      <DialogActions>
        <Button variant="secondary" onClick={handleCancel} disabled={loading}>Cancel</Button>
        <Button form={FORM_ID} type="submit" disabled={loading}>{submitLabel}</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
