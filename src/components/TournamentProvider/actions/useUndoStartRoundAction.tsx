import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { Warning } from '~/components/generic/Warning';
import { toast } from '~/components/ToastProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useEndTournamentRound, useGetTournamentOpenRound } from '~/services/tournaments';

import styles from '../actions/shared.module.scss';

const KEY = TournamentActionKey.UndoStartRound;

export const useUndoStartRoundAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const currentRoundLabel = (subject.currentRound ?? 0) + 1;
  const label = `Undo Start Round ${currentRoundLabel}`;
  const { open, close } = useDialogInstance();
  const { data: openRound } = useGetTournamentOpenRound({ id: subject._id });
  const { mutation } = useEndTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${currentRoundLabel} reset!`);
      close();
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label,
      handler: () => {
        const alreadyHasMatchResults = openRound && openRound.matchResultsProgress.submitted > 0;
        open({
          title: 'Warning!',
          content: (
            <div className={styles.Action_DialogContent}>
              <span>{`Are you sure you want to reset round ${currentRoundLabel}?`}</span>
              {alreadyHasMatchResults && (
                <span>
                  {`This round already has ${openRound.matchResultsProgress.submitted} matches results checked in. They will be deleted as part of the reset.`}
                </span>
              )}
              <Warning
                title="This action cannot be undone!"
                intent="danger"
                description="You'll need to start the round over from the beginning."
              />
            </div>
          ),
          actions: [
            {
              intent: 'danger',
              onClick: () => mutation({ id: subject._id, reset: true }),
              text: label,
            },
          ],
        });
      },
    };
  }
  return null;
};
