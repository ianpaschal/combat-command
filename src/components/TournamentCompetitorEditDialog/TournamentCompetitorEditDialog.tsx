import { MouseEvent } from 'react';
import { Ellipsis, FileText } from 'lucide-react';

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
import { useGetTournamentRegistrationsByCompetitor } from '~/services/tournamentRegistrations';
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
    data: tournamentRegistrations,
  } = useGetTournamentRegistrationsByCompetitor(competitor ? {
    tournamentCompetitorId: competitor._id,
  } : 'skip');

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
        if (tournament.requireRealNames && user.nameVisibility < VisibilityLevel.Tournaments) {
          openConfirmNameVisibilityDialog();
        }
      } else {
        // No need to warn as nameVisibility is only forced for users who add register themselves.
        createTournamentCompetitor({
          captainUserId: captain.userId!, // Already validated in form
          ...restFormData,
        });
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
        {(tournamentRegistrations ?? []).map((reg) => (
          <div key={reg._id}>
            <div>ID BADGE</div>
            <Button icon={<FileText />} />
            <Button icon={<Ellipsis />} />
          </div>
        ))}
      </ScrollArea>
      <DialogActions>
        <Button disabled={loading} text="Cancel" variant="secondary" onClick={handleCancel} />
        <Button disabled={loading} form={FORM_ID} text={competitor ? 'Save Changes' : 'Create'} type="submit" />
      </DialogActions>
    </ControlledDialog>
  );
};
