import { Trash } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { Warning } from '~/components/generic/Warning';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useDeleteTournamentCompetitor } from '~/services/tournamentCompetitors';

import styles from '../actions/shared.module.scss';

const LABEL = 'Remove';
const KEY = TournamentCompetitorActionKey.Delete;

export const useDeleteAction = (
  subject: TournamentCompetitor,
): ActionDefinition<TournamentCompetitorActionKey> | null => {
  const tournament = useTournament();
  const { open, close } = useDialogInstance();
  const { mutation } = useDeleteTournamentCompetitor({
    onSuccess: () => {
      toast.success(`${subject.displayName} has been removed from ${tournament.displayName}`);
      close();
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      icon: <Trash />,
      handler: () => open({
        title: `Remove ${subject.displayName}`,
        content: (
          <div className={styles.Action_DialogContent}>
            <span>{`Are you sure you want to remove ${subject.displayName} from ${tournament.displayName}?`}</span>
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
