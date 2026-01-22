import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { usePublishTournament } from '~/services/tournaments';

const LABEL = 'Publish';
const KEY = TournamentActionKey.Publish;

export const usePublishAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const { mutation } = usePublishTournament({
    onSuccess: (): void => {
      toast.success(`${subject.displayName} is now published!`);
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
