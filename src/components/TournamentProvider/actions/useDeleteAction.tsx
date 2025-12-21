import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useNavigateAway } from '~/hooks/useNavigateAway';
import { useDeleteTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';

const LABEL = 'Delete';
const KEY = TournamentActionKey.Delete;

export const useDeleteAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const displayName = getTournamentDisplayName(subject);
  const navigate = useNavigateAway(PATHS.tournamentDetails, PATHS.tournaments);
  const { open, close } = useDialogInstance();
  const { mutation } = useDeleteTournament({
    onSuccess: (): void => {
      toast.success(`${displayName} deleted!`);
      navigate();
      close();
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      handler: () => open({
        title: 'Warning!',
        content: (
          <span>{`Are you sure you want to delete ${displayName}?`}<strong>This cannot be undone!</strong></span>
        ),
        actions: [
          {
            intent: 'danger',
            onClick: () => mutation({ id: subject._id }),
            text: 'Remove',
          },
        ],
      }),
    };
  }
  return null;
};
