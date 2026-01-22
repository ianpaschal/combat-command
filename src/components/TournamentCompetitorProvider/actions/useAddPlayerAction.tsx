import { UserPlus } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { useCreateRegistrationAction } from '~/components/TournamentProvider';

export const useAddPlayerAction = (subject: TournamentCompetitor) => useCreateRegistrationAction(subject, {
  key: TournamentCompetitorActionKey.AddPlayer,
  label: 'Add Player',
  icon: <UserPlus />,
}, {
  tournamentCompetitorId: subject._id,
});
