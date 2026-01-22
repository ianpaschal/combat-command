import { LogOut } from 'lucide-react';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { useDeleteRegistrationAction } from '~/components/TournamentProvider';

export const useLeaveAction = (
  subject: TournamentRegistration,
) => useDeleteRegistrationAction(subject, {
  key: TournamentRegistrationActionKey.Leave,
  label: 'Leave',
  icon: <LogOut />,
}, subject);
