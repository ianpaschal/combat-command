import { generatePath } from 'react-router-dom';
import { Trash } from 'lucide-react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { ActionDefinition } from '~/components/ContextMenu/ContextMenu.types';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useDialogInstance } from '~/hooks/useDialogInstance';
import { useNavigateAway } from '~/hooks/useNavigateAway';
import { useDeleteTournamentCompetitor } from '~/services/tournamentCompetitors';
import { PATHS } from '~/settings';

const LABEL = 'Remove';
const KEY = TournamentCompetitorActionKey.Delete;

export const useDeleteAction = (
  subject: TournamentCompetitor,
): ActionDefinition<TournamentCompetitorActionKey> | null => {
  const tournament = useTournament();
  const navigateToTournament = useNavigateAway(PATHS.tournamentCompetitorDetails, generatePath(PATHS.tournamentDetails, {
    id: subject.tournamentId,
  }));
  const { open, close } = useDialogInstance();
  const { mutation } = useDeleteTournamentCompetitor({
    onSuccess: () => {
      navigateToTournament();
      close();
      toast.success(`${subject.displayName} has been removed.`);
    },
  });
  if (subject.availableActions.includes(KEY)) {
    return {
      key: KEY,
      label: LABEL,
      icon: <Trash />,
      handler: () => open({
        title: 'Warning!',
        content: (
          <>
            <span>{`Are you sure you want to remove ${subject.displayName} from ${tournament.displayName}?`}</span>
            <br />
            <strong>Once removed, it cannot be restored!</strong>
          </>
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
