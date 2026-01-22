import { LogIn } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { useCreateRegistrationAction } from '~/components/TournamentProvider';

export const useJoinAction = (subject: TournamentCompetitor) => {
  const currentUser = useAuth();
  return useCreateRegistrationAction(subject, {
    key: TournamentCompetitorActionKey.Join,
    label: 'Join',
    icon: <LogIn />,
  }, {
    tournamentCompetitorId: subject._id,
    userId: currentUser?._id,
  });
};
