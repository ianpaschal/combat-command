import { LogOut } from 'lucide-react';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { Warning } from '~/components/generic/Warning';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider/TournamentProvider.hooks';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useGetTournamentCompetitor } from '~/services/tournamentCompetitors';
import { useDeleteTournamentRegistration } from '~/services/tournamentRegistrations';
import { getDeleteWarnings } from '../TournamentRegistrationProvider.utils';

const LABEL = 'Leave';
const KEY = TournamentRegistrationActionKey.Leave;

export const useLeaveAction = (
  subject: TournamentRegistration | null,
): ActionDefinition<TournamentRegistrationActionKey> | null => {
  const tournament = useTournament();
  const { data: tournamentCompetitor } = useGetTournamentCompetitor(subject ? {
    id: subject.tournamentCompetitorId,
  } : 'skip');

  const { open, close } = useDialogInstance();
  const { mutation } = useDeleteTournamentRegistration({
    onSuccess: ({ wasLast }) => {
      if (tournament.useTeams && !wasLast) {
        toast.success(`You have left ${tournamentCompetitor?.displayName}.`);
      } else {
        toast.success(`You have left ${tournament.displayName}.`);
      }
      close();
    },
  });

  if (!subject || !tournamentCompetitor) {
    return null;
  }

  return (subject.availableActions.includes(KEY)) ? {
    key: KEY,
    label: LABEL,
    icon: <LogOut />,
    handler: () => open({
      title: 'Warning!',
      content: (
        <>
          <span>
            {tournament.useTeams ? (
              `Are you sure you want to leave ${tournamentCompetitor.displayName}?`
            ) : (
              `Are you sure you want to leave ${tournament.displayName}?`
            )}
          </span>
          {getDeleteWarnings(tournament, tournamentCompetitor).map((warning, i) => (
            <Warning key={i}>{warning}</Warning>
          ))}
        </>
      ),
      actions: [
        {
          intent: 'danger',
          onClick: () => mutation({ id: subject._id }),
          text: LABEL,
        },
      ],
    }),
  } : null;
};
