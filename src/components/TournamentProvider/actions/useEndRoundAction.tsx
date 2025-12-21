import { Tournament, TournamentActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useEndTournamentRound, useGetTournamentOpenRound } from '~/services/tournaments';

const KEY = TournamentActionKey.EndRound;

export const useEndRoundAction = (
  subject: Tournament,
): ActionDefinition<TournamentActionKey> | null => {
  const currentRoundLabel = (subject.currentRound ?? 0) + 1;
  const label = `End Round ${currentRoundLabel}`;
  const { open, close } = useDialogInstance();
  const { data: openRound } = useGetTournamentOpenRound({ id: subject._id });
  const { mutation } = useEndTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${currentRoundLabel} completed!`);
      close();
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label,
      handler: () => {
        if (openRound && openRound.matchResultsProgress.remaining > 0) {
          open({
            title: 'Warning!',
            content: (
              <>
                <span>{`
                  Are you sure you want to end round ${currentRoundLabel}?
                  There are still ${openRound.matchResultsProgress.remaining}
                  matches remaining to be checked in.
                `}</span>
                <strong>Once the round is ended, it cannot be repeated!</strong>
              </>
            ),
            actions: [
              {
                intent: 'danger',
                onClick: () => mutation({ id: subject._id }),
                text: 'End Round',
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
