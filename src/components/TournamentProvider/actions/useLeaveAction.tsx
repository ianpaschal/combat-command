import { LogOut } from 'lucide-react';

import { Tournament, TournamentActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { useDeleteRegistrationAction } from '~/components/TournamentProvider';
import { useGetTournamentRegistrationByTournamentUser } from '~/services/tournamentRegistrations';

export const useLeaveAction = (
  subject: Tournament,
) => {
  const currentUser = useAuth();
  const { data: tournamentRegistration } = useGetTournamentRegistrationByTournamentUser(currentUser ? {
    userId: currentUser._id,
    tournamentId: subject._id,
  } : 'skip');
  return useDeleteRegistrationAction(subject, {
    key: TournamentActionKey.Leave,
    label: 'Leave',
    icon: <LogOut />,
  }, tournamentRegistration);
};
