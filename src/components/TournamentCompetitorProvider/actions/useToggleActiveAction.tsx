import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useToggleTournamentCompetitorActive } from '~/services/tournamentCompetitors';

const KEY = TournamentCompetitorActionKey.ToggleActive;

export const useToggleActiveAction = (
  subject: TournamentCompetitor,
): ActionDefinition<TournamentCompetitorActionKey> | null => {
  const { mutation } = useToggleTournamentCompetitorActive({
    onSuccess: () => toast.success(`${subject.displayName} is now active!`),
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: subject.active ? 'Make Inactive' : 'Make Active',
      handler: () => mutation({ id: subject._id }),
    };
  }
  return null;
};
