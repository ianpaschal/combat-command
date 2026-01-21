import { LogOut } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { useDeleteRegistrationAction } from '~/components/TournamentProvider';
import { useGetTournamentRegistrationByTournamentUser } from '~/services/tournamentRegistrations';

export const useLeaveAction = (
  subject: TournamentCompetitor,
) => {
  const currentUser = useAuth();
  const { data: tournamentRegistration } = useGetTournamentRegistrationByTournamentUser(currentUser ? {
    userId: currentUser._id,
    tournamentId: subject.tournamentId,
  } : 'skip');
  return useDeleteRegistrationAction(subject, {
    key: TournamentCompetitorActionKey.Leave,
    label: 'Leave',
    icon: <LogOut />,
  }, tournamentRegistration);
};
