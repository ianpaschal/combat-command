import { UserCheck, UserX } from 'lucide-react';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useToggleTournamentRegistrationActive } from '~/services/tournamentRegistrations';

const KEY = TournamentRegistrationActionKey.ToggleActive;

export const useToggleActiveAction = (
  subject: TournamentRegistration,
): ActionDefinition<TournamentRegistrationActionKey> | null => {
  const user = useAuth();
  const { mutation } = useToggleTournamentRegistrationActive({
    onSuccess: (active): void => toast.success(`${user?._id === subject.userId ? 'You are' : `${subject.displayName} is`} now ${active ? 'active' : 'inactive'}.`),
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: subject.active ? 'Deactivate' : 'Activate',
      icon: subject.active ? <UserX /> : <UserCheck />,
      handler: () => mutation({ id: subject._id }),
    };
  }
  return null;
};
