import { UserPlus } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useCreateTournamentRegistration } from '~/services/tournamentRegistrations';

const LABEL = 'Join';
const KEY = TournamentCompetitorActionKey.Join;

export const useJoinAction = (
  subject: TournamentCompetitor,
): ActionDefinition<TournamentCompetitorActionKey> | null => {
  const user = useAuth();
  const { mutation } = useCreateTournamentRegistration({
    onSuccess: () => toast.success(`You have joined ${subject.displayName}!`),
  });
  if (subject.availableActions.includes(KEY) && user) {
    return {
      key: KEY,
      label: LABEL,
      icon: <UserPlus />,
      handler: () => {
        // TODO: Show warning if full (thus waitlist)
        // TODO: Show warning if tournament has name requirements
        mutation({
          tournamentCompetitorId: subject._id,
          tournamentId: subject.tournamentId,
          userId: user._id,
        });
      },
    };
  }
  return null;
};
