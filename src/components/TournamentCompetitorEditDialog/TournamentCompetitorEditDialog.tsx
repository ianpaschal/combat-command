import { MouseEvent } from 'react';

import { TournamentCompetitor, VisibilityLevel } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { TournamentCompetitorForm, TournamentCompetitorSubmitData } from '~/components/TournamentCompetitorForm';
import { useTournament } from '~/components/TournamentProvider';
import { useConfirmRegisterDialog } from '~/pages/TournamentDetailPage/components/ConfirmRegisterDialog';
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
  const user = useAuth();
  const tournament = useTournament();
  const { open: openConfirmNameVisibilityDialog } = useConfirmRegisterDialog();
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
      const captainIsCurrentUser = captain.userId && user && captain.userId === user._id;
      if (captainIsCurrentUser) {
        const nameVisibility = typeof user?.nameVisibility === 'number' ? user.nameVisibility : 0;
        if (tournament.requireRealNames && nameVisibility < VisibilityLevel.Tournaments) {
          openConfirmNameVisibilityDialog();
        } else {
          // No need to warn as nameVisibility is only forced for users who add register themselves.
          createTournamentCompetitor({
            captainUserId: captain.userId!, // Already validated in form
            ...restFormData,
          });
        }
      }
    }
  };

  const loading = createTournamentCompetitorLoading || updateTournamentCompetitorLoading;

  const getTitle = () => {
    if (competitor) {
      if (tournament.useTeams) {
        return `Edit Team ${getTournamentCompetitorDisplayName(competitor)}`;
      } else {
        return 'Edit Player';
      }
    } else {
      if (tournament.useTeams) {
        return 'Create Team';
      } else {
        return 'Create Player';
      }
    }
  };

  return (
    <ControlledDialog id={dialogId} disabled={loading} width="small">
      <DialogHeader title={getTitle()} onCancel={handleCancel} />
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
        <Button form={FORM_ID} type="submit" disabled={loading}>{competitor ? 'Save Changes' : 'Create'}</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
