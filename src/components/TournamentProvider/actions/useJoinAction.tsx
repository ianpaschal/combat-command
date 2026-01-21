import { LogIn } from 'lucide-react';

import { Tournament, TournamentActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { useCreateRegistrationAction } from '../utils/useCreateRegistrationAction';

export const useJoinAction = (subject: Tournament) => {
  const currentUser = useAuth();
  return useCreateRegistrationAction(subject, {
    key: TournamentActionKey.Join,
    label: 'Join',
    icon: <LogIn />,
  }, {
    userId: currentUser?._id,
  });
};
