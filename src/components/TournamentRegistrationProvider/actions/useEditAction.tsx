import { Pencil } from 'lucide-react';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentRegistrationForm } from '~/components/TournamentRegistrationForm';
import { useFormDialog } from '~/hooks/useFormDialog';
import { useUpdateTournamentRegistration } from '~/services/tournamentRegistrations';

const LABEL = 'Edit';
const KEY = TournamentRegistrationActionKey.Edit;

export const useEditAction = (
  subject: TournamentRegistration,
): ActionDefinition<TournamentRegistrationActionKey> | null => {
  const tournament = useTournament();
  const { mutation } = useUpdateTournamentRegistration({
    onSuccess: (): void => {
      toast.success(`Saved changes to ${subject.displayName}!`);
      close();
    },
  });

  const { open, close } = useFormDialog({
    formId: 'edit-tournament-registration',
    title: `Edit ${subject.displayName}`,
    submitLabel: 'Save Changes',
    content: (
      <TournamentRegistrationForm
        tournament={tournament}
        existingValues={subject}
        onSubmit={({
          nameVisibilityConsent: _nameVisibilityConsent, // Only used for new registrations
          tournamentCompetitor: _tournamentCompetitor, // Only used for new registrations
          tournamentCompetitorId: _tournamentCompetitorId,
          tournamentId: _tournamentId,
          userId: _userId,
          ...data
        }) => mutation({ _id: subject._id, ...data })}
      />
    ),
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      icon: <Pencil />,
      handler: () => open(),
    };
  }
  return null;
};
