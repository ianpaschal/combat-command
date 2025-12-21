import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useEndTournament } from '~/services/tournaments';

const LABEL = 'End Tournament';
const KEY = TournamentActionKey.End;

export const useEndAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const remainingRoundsLabel = subject.roundCount - ((subject.lastRound ?? -1) + 1);
  const { open, close } = useDialogInstance();
  const { mutation } = useEndTournament({
    onSuccess: (): void => {
      toast.success(`${subject.displayName} completed!`);
      close();
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      handler: () => {
        if (subject.nextRound !== undefined && subject.nextRound < subject.roundCount) {
          open({
            title: 'Warning!',
            content: (
              <>
                <span>{`Are you sure you want to end ${subject.displayName}? There are still ${remainingRoundsLabel} rounds remaining.`}</span>
                <strong>Once the tournament is ended, it cannot be restarted!</strong>
              </>
            ),
            actions: [
              {
                intent: 'danger',
                onClick: () => mutation({ id: subject._id }),
                text: LABEL,
              },
            ],
          });
        } else {
          mutation({ id: subject._id });
        }
      },
    };
  }
  return null;
};
