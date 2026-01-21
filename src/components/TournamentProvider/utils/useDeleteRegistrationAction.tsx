import { TournamentActionKey, TournamentRegistration } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import {
  ActionDefinition,
  ActionKey,
  ActionOverride,
} from '~/components/ContextMenu/ContextMenu.types';
import { Warning } from '~/components/generic/Warning';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider/TournamentProvider.hooks';
import { getDeleteRegistrationWarnings } from '~/components/TournamentProvider/utils/getDeleteRegistrationWarnings';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useGetTournamentCompetitor } from '~/services/tournamentCompetitors';
import { useDeleteTournamentRegistration } from '~/services/tournamentRegistrations';

import styles from '../actions/shared.module.scss';

export const useDeleteRegistrationAction = <T extends ActionKey = TournamentActionKey>(
  subject: {
    availableActions: T[];
  },
  definition: ActionOverride<T>,
  tournamentRegistration?: TournamentRegistration | null,
): ActionDefinition<T> | null => {
  const currentUser = useAuth();
  const tournament = useTournament();
  const { data: tournamentCompetitor } = useGetTournamentCompetitor(tournamentRegistration ? {
    id: tournamentRegistration.tournamentCompetitorId,
  } : 'skip');
  const { mutation } = useDeleteTournamentRegistration({
    onSuccess: ({ success }): void => {
      if (success?.message) {
        toast.success(success.message);
      }
      close();
    },
  });

  const { open, close } = useDialogInstance();

  if (!currentUser || !tournamentRegistration || !tournamentCompetitor) {
    return null;
  }

  const isSelf = currentUser._id === tournamentRegistration.userId;

  return subject.availableActions.includes(definition.key) ? {
    ...definition,
    handler: () => open({
      title: 'Warning!',
      content: (
        <div className={styles.Action_DialogContent}>
          <span>
            {tournament.useTeams ? (
              isSelf ? (
                `Are you sure you want to leave ${tournamentCompetitor.displayName}?`
              ) : (
                `Are you sure you want to remove ${tournamentRegistration.displayName} from ${tournamentCompetitor.displayName}?`
              )
            ) : (
              isSelf ? (
                `Are you sure you want to leave ${tournament.displayName}?`
              ) : (
                `Are you sure you want to remove ${tournamentRegistration.displayName} from ${tournament.displayName}?`
              )
            )}
          </span>
          {getDeleteRegistrationWarnings(tournament, tournamentCompetitor).map((warning, i) => (
            <Warning key={i}>{warning}</Warning>
          ))}
        </div>
      ),
      actions: [
        {
          intent: 'danger',
          onClick: () => mutation({ id: tournamentRegistration._id }),
          text: definition.label,
        },
      ],
    }),
  } : null;
};
