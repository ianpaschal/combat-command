import { UserPlus } from 'lucide-react';

import { Tournament, TournamentActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentRegistrationForm } from '~/components/TournamentRegistrationForm';
import { useFormDialog } from '~/hooks/useFormDialog';
import { useCreateTournamentRegistration } from '~/services/tournamentRegistrations';

const LABEL = 'Join';
const KEY = TournamentActionKey.Join;

export const useJoinAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const user = useAuth();
  const tournament = useTournament();
  const { mutation } = useCreateTournamentRegistration({
    onSuccess: (): void => {
      toast.success(`You have joined ${subject.displayName}!`);
      close();
    },
  });
  const { open, close } = useFormDialog({
    formId: 'create-tournament-registration-form',
    title: LABEL,
    submitLabel: LABEL,
    content: (
      <TournamentRegistrationForm
        forcedValues={{
          tournamentId: tournament._id,
          userId: user?._id, // Anonymous users are blocked from creating a registration anyway.
        }}
        onSubmit={(data) => mutation(data)}
      />
    ),
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      icon: <UserPlus />,
      handler: () => open(),
    };
  }
  return null;
};
