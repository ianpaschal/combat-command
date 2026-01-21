import {
  getTournamentDisplayName,
  Tournament,
  TournamentActionKey,
} from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { Warning } from '~/components/generic/Warning';
import { toast } from '~/components/ToastProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useNavigateAway } from '~/hooks/useNavigateAway';
import { useDeleteTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';

import styles from '../actions/shared.module.scss';

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
        title: `Delete ${subject.displayName}?`,
        content: (
          <div className={styles.Action_DialogContent}>
            <span>{`Are you sure you want to delete ${displayName}?`}</span>
            <Warning title="This cannot be undone!" intent="danger" />
          </div>
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
