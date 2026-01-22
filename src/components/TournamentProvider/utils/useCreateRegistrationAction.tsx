import {
  TournamentActionKey,
  TournamentCompetitorId,
  UserId,
} from '~/api';
import { useAuth } from '~/components/AuthProvider';
import {
  ActionDefinition,
  ActionKey,
  ActionOverride,
} from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider/TournamentProvider.hooks';
import { createSchema, TournamentRegistrationForm } from '~/components/TournamentRegistrationForm';
import { useFormDialog } from '~/hooks/useFormDialog';
import { useCreateTournamentRegistration } from '~/services/tournamentRegistrations';

export const useCreateRegistrationAction = <T extends ActionKey = TournamentActionKey>(
  subject: {
    availableActions: T[];
  },
  definition: ActionOverride<T>,
  values?: {
    userId?: UserId;
    tournamentCompetitorId?: TournamentCompetitorId;
  },
): ActionDefinition<T> | null => {
  const currentUser = useAuth();
  const tournament = useTournament();
  const { mutation } = useCreateTournamentRegistration({
    onSuccess: ({ success }): void => {
      if (success?.message) {
        toast.success(success.message);
      }
      close();
    },
  });

  const forcedValues = {
    tournamentId: tournament._id,
    ...values,
  };

  const { open, close } = useFormDialog({
    formId: 'create-tournament-registration-form',
    title: definition.label,
    submitLabel: definition.label,
    content: (
      <TournamentRegistrationForm
        forcedValues={forcedValues}
        onSubmit={(data) => mutation(data)}
        tournament={tournament}
      />
    ),
  });

  return subject.availableActions.includes(definition.key) ? {
    ...definition,
    handler: () => {
      // If the existing data is enough to trigger the mutation, skip the form entirely:
      const { data } = createSchema(tournament, currentUser).safeParse(forcedValues);
      if (data) {
        mutation(data);
      } else {
        open();
      }
    },
  } : null;
};
