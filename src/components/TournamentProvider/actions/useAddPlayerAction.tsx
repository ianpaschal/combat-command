import { UserPlus } from 'lucide-react';

import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { TournamentRegistrationForm } from '~/components/TournamentRegistrationForm';
import { useFormDialog } from '~/hooks/useFormDialog';
import { useCreateTournamentRegistration } from '~/services/tournamentRegistrations';

const LABEL = 'Add Player';
const KEY = TournamentActionKey.AddPlayer;

export const useAddPlayerAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const { mutation } = useCreateTournamentRegistration({
    onSuccess: (response): void => {
      toast.success(`${response.user?.displayName ?? 'Unknown Player'} has been added to ${subject.displayName}!`);
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
          tournamentId: subject._id,
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
