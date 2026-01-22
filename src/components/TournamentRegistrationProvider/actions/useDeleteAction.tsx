import { UserMinus } from 'lucide-react';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { useDeleteRegistrationAction } from '~/components/TournamentProvider';

export const useDeleteAction = (
  subject: TournamentRegistration,
) => useDeleteRegistrationAction(subject, {
  key: TournamentRegistrationActionKey.Delete,
  label: 'Remove',
  icon: <UserMinus />,
}, subject);
