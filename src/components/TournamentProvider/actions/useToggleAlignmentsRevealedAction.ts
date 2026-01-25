import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useToggleTournamentAlignmentsRevealed } from '~/services/tournaments';

const KEY = TournamentActionKey.ToggleAlignmentsRevealed;

export const useToggleAlignmentsRevealedAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const { mutation } = useToggleTournamentAlignmentsRevealed({
    onSuccess: (revealed): void => toast.success(`${subject.displayName} is now ${revealed ? 'active' : 'inactive'}.`),
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: subject.alignmentsRevealed ? 'Hide Alignments' : 'Reveal Alignments',
      handler: () => mutation({ id: subject._id }),
    };
  }
  return null;
};
