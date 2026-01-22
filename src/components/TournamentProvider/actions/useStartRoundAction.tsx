import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useStartTournamentRound } from '~/services/tournaments';
const KEY = TournamentActionKey.StartRound;

export const useStartRoundAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const nextRoundLabel = (subject.nextRound ?? 0) + 1;
  const currentRoundLabel = (subject.currentRound ?? 0) + 1;
  const { mutation } = useStartTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${currentRoundLabel} started!`);
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: `Start Round ${nextRoundLabel}`,
      handler: () => mutation({ id: subject._id }),
    };
  }
  return null;
};
