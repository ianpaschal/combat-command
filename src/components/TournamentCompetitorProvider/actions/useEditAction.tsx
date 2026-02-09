import { Pencil } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { TournamentCompetitorForm } from '~/components/TournamentCompetitorForm';
import { useTournament } from '~/components/TournamentProvider';
import { useFormDialog } from '~/hooks/useFormDialog';
import { useUpdateTournamentCompetitor } from '~/services/tournamentCompetitors';

const LABEL = 'Edit';
const KEY = TournamentCompetitorActionKey.Edit;

export const useEditAction = (
  subject: TournamentCompetitor,
): ActionDefinition<TournamentCompetitorActionKey> | null => {
  const tournament = useTournament();
  const { mutation } = useUpdateTournamentCompetitor({
    onSuccess: (): void => {
      toast.success(`Saved changes to ${subject.displayName}!`);
      close();
    },
  });
  const { open, close } = useFormDialog({
    formId: 'edit-tournament-competitor',
    title: `Edit ${subject.displayName}`,
    submitLabel: 'Save Changes',
    content: (
      <TournamentCompetitorForm
        tournament={tournament}
        existingValues={subject}
        onSubmit={(data) => mutation({
          id: subject._id,
          ...data,
        })}
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
