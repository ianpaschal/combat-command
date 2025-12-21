import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { useMatchResultCreateDialog } from '~/components/MatchResultCreateDialog';

const LABEL = 'Submit Match Result';
const KEY = TournamentActionKey.SubmitMatchResult;

export const useSubmitMatchResultAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  // TODO: Replace with new dialog
  const { open: openMatchResultCreateDialog } = useMatchResultCreateDialog();
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      handler: () => openMatchResultCreateDialog(),
    };
  }
  return null;
};
