import { LogOut } from 'lucide-react';

import { Tournament, TournamentActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useGetTournamentCompetitor } from '~/services/tournamentCompetitors';
import { useDeleteTournamentRegistration, useGetTournamentRegistrationByTournamentUser } from '~/services/tournamentRegistrations';

const LABEL = 'Leave';
const KEY = TournamentActionKey.Leave;

export const useLeaveAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const user = useAuth();
  const { open, close } = useDialogInstance();

  const { data: ownRegistration } = useGetTournamentRegistrationByTournamentUser(user ? {
    userId: user._id,
    tournamentId: subject._id,
  } : 'skip');
  const { data: ownCompetitor } = useGetTournamentCompetitor(ownRegistration ? {
    id: ownRegistration.tournamentCompetitorId,
  } : 'skip');

  const { mutation } = useDeleteTournamentRegistration({
    onSuccess: ({ wasLast }) => {
      if (subject.useTeams && ownCompetitor) {
        if (wasLast) {
          toast.success(`${ownCompetitor.displayName} has left ${subject.displayName}.`);
        } else {
          toast.success(`You have left ${ownCompetitor.displayName}.`);
        }
      } else {
        toast.success(`You have left ${subject.displayName}.`);
      }
      close();
    },
  });

  if (!ownRegistration || !ownCompetitor) {
    return null;
  }
  const hasOtherPlayers = ownCompetitor.registrations.length > 1;
  const hasSparePlayers = ownCompetitor.registrations.length > subject.competitorSize;
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      icon: <LogOut />,
      handler: () => {
        if (user && subject.useTeams && hasOtherPlayers && !hasSparePlayers) {
          open({
            title: 'Warning!',
            content: (
              <span>{`Are you sure you want to leave ${subject.displayName}? You will leave team ${ownCompetitor.displayName} short-handed.`}</span>
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
