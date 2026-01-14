import { generatePath } from 'react-router-dom';
import { Trash } from 'lucide-react';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useTournamentCompetitor } from '~/components/TournamentCompetitorProvider/TournamentCompetitorProvider.hooks';
import { useTournament } from '~/components/TournamentProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useNavigateAway } from '~/hooks/useNavigateAway';
import { useDeleteTournamentRegistration } from '~/services/tournamentRegistrations';
import { PATHS } from '~/settings';

const LABEL = 'Remove';
const KEY = TournamentRegistrationActionKey.Delete;

export const useDeleteAction = (
  subject: TournamentRegistration,
): ActionDefinition<TournamentRegistrationActionKey> | null => {
  const tournamentCompetitor = useTournamentCompetitor();
  const tournament = useTournament();
  const navigateToTournament = useNavigateAway(PATHS.tournamentCompetitorDetails, generatePath(PATHS.tournamentDetails, {
    id: subject.tournamentId,
  }));
  const { open, close } = useDialogInstance();
  const { mutation } = useDeleteTournamentRegistration({
    onSuccess: ({ wasLast }) => {
      if (wasLast) {
        navigateToTournament();
      }
      if (tournament.useTeams) {
        if (wasLast) {
          toast.success(`${tournamentCompetitor.displayName} has been removed from ${tournament.displayName}.`);
        } else {
          toast.success(`${subject.displayName} has been removed from ${tournamentCompetitor.displayName}`);
        }
      } else {
        toast.success(`${subject.displayName} has been removed from ${tournament.displayName}.`);
      }
      close();
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      icon: <Trash />,
      intent: 'danger',
      handler: () => open({
        title: 'Warning!',
        content: (
          <span>{`Are you sure you want to remove ${subject.displayName}?`}</span>
        ),
        actions: [
          {
            intent: 'danger',
            onClick: () => mutation({ id: subject._id }),
            text: LABEL,
          },
        ],
      }),
    };
  }
  return null;
};
