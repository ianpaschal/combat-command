import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useStartTournament } from '~/services/tournaments';

const LABEL = 'Start';
const KEY = TournamentActionKey.Start;

export const useStartAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const { mutation } = useStartTournament({
    onSuccess: (): void => {
      toast.success(`${subject.displayName} started!`);
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      handler: () => mutation({ id: subject._id }),
    };
  }
  return null;
};
