import { generatePath } from 'react-router-dom';
import { UserMinus } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useNavigateAway } from '~/hooks/useNavigateAway';
import { useDeleteTournamentRegistration } from '~/services/tournamentRegistrations';
import { PATHS } from '~/settings';

const LABEL = 'Leave';
const KEY = TournamentCompetitorActionKey.Leave;

export const useLeaveAction = (
  subject: TournamentCompetitor,
): ActionDefinition<TournamentCompetitorActionKey> | null => {
  const user = useAuth();
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
          toast.success(`${subject.displayName} has left ${tournament.displayName}.`);
        } else {
          toast.success(`You have left ${subject.displayName}.`);
        }
      } else {
        toast.success(`You have left ${tournament.displayName}.`);
      }
      close();
    },
  });
  const ownRegistration = subject.registrations.find((r) => r.userId === user?._id);
  const hasOtherPlayers = subject.registrations.length > 1;
  const hasSparePlayers = subject.registrations.length > tournament.competitorSize;
  if (!ownRegistration) {
    return null;
  }
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      icon: <UserMinus />,
      handler: () => {
        if (user && tournament.useTeams && hasOtherPlayers && !hasSparePlayers) {
          open({
            title: 'Warning!',
            content: (
              <span>{`Are you sure you want to leave team ${subject.displayName}? You will leave the team short-handed.`}</span>
            ),
            actions: [
              {
                intent: 'danger',
                onClick: () => mutation({ id: ownRegistration._id }),
                text: 'Leave',
              },
            ],
          });
        } else {
          mutation({ id: ownRegistration._id });
        }
      },
    };
  }
  return null;
};
