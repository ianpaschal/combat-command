import { UserPlus } from 'lucide-react';

import { Tournament, TournamentActionKey } from '~/api';
import { useCreateRegistrationAction } from '../utils/useCreateRegistrationAction';

export const useAddPlayerAction = (subject: Tournament) => useCreateRegistrationAction(subject, {
  key: TournamentActionKey.AddPlayer,
  label: 'Add Player',
  icon: <UserPlus />,
});
