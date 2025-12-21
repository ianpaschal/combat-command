import { useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialogData } from '~/components/ConfirmationDialog';
import { toast } from '~/components/ToastProvider';
import { useTournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog';
import { useTournament } from '~/components/TournamentProvider';
import { useDeleteTournamentCompetitor } from '~/services/tournamentCompetitors';
import { useCreateTournamentRegistration, useDeleteTournamentRegistration } from '~/services/tournamentRegistrations';
import { PATHS } from '~/settings';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';
import {
  ActionDefinition,
  TournamentCompetitorActions,
  TournamentCompetitorContext,
} from './TournamentCompetitorProvider.context';

export const useTournamentCompetitor = () => {
  const context = useContext(TournamentCompetitorContext);
  if (!context) {
    throw Error('useTournamentCompetitor must be used within a <TournamentCompetitorProvider />!');
  }
  return context;
};

export const useActions = (
  tournamentCompetitor: TournamentCompetitor,
  openConfirmDialog: (data?: ConfirmationDialogData) => void,
): TournamentCompetitorActions => {
  const navigate = useNavigate();
  // const location = useLocation();
  const user = useAuth();
  const tournament = useTournament(); // TODO: Support fetching tournament by ID if it doesn't exist

  const displayName = getTournamentCompetitorDisplayName(tournamentCompetitor);

  // ---- HANDLERS ----

  // On "Edit"
  const { open: openEditDialog } = useTournamentCompetitorEditDialog(tournamentCompetitor._id);

  // On "Delete"
  const { mutation: deleteTournamentCompetitor } = useDeleteTournamentCompetitor({
    onSuccess: (): void => {
      toast.success(`${displayName} deleted!`);
      // TODO: Don't navigate if current location === target
      navigate(generatePath(PATHS.tournamentDetails, { id: tournamentCompetitor.tournamentId }));
    },
  });

  // On "Join"
  const { mutation: createTournamentRegistration } = useCreateTournamentRegistration({
    onSuccess: (): void => {
      toast.success(`Joined ${displayName}!`);
    },
  });

  // On "Leave"
  const { mutation: deleteTournamentRegistration } = useDeleteTournamentRegistration({
    onSuccess: (): void => {
      toast.success(`Left ${displayName}!`);
    },
  });

  // ---- DATA ----
  const { availableActions } = tournamentCompetitor;
  const tournamentRegistration = tournamentCompetitor.registrations.find((r) => r.userId === user?._id);
  const activeUserIds = tournamentCompetitor.registrations.filter((r) => r.active).map((r) => r.userId);
  // const { data: openRound } = useGetTournamentOpenRound({
  //   id: tournament._id,
  // });
  // const { data: tournamentCompetitors } = use({
  //   tournamentId: tournament._id,
  // });

  // Labels for messages:
  // const nextRoundLabel = (tournament.nextRound ?? 0) + 1;
  // const currentRoundLabel = (tournament.currentRound ?? 0) + 1;
  // const remainingRoundsLabel = tournament.roundCount - ((tournament.lastRound ?? -1) + 1);

  // ---- ACTIONS ----
  const actions: ActionDefinition[] = user ? [
    {
      key: TournamentCompetitorActionKey.Edit,
      label: 'Edit',
      handler: () => openEditDialog(),
    },
    {
      key: TournamentCompetitorActionKey.Delete,
      label: 'Delete',
      handler: () => {
        openConfirmDialog({
          title: 'Warning!',
          description: (
            <>
              <span>{`Are you sure you want to delete ${displayName}?`}</span>
              <strong>Once deleted, it cannot be restored!</strong>
            </>
          ),
          onConfirm: () => deleteTournamentCompetitor({
            id: tournamentCompetitor._id,
          }),
          confirmLabel: `Delete ${tournament.useTeams ? 'Team' : 'Player'}`,
          intent: 'danger',
        });
      },
    },
    {
      key: TournamentCompetitorActionKey.Join,
      label: 'Join',
      handler: () => {
        // TODO: Show warning if full (thus waitlist)
        // TODO: Show warning if tournament has name requirements
        //         if (openRound && openRound.matchResultsProgress.remaining > 0) {
        //           openDialog({
        //             title: 'Warning!',
        //             description: (
        //               <>
        //                 <span>{`
        //                   Are you sure you want to end round ${currentRoundLabel}?
        //                   There are still ${openRound.matchResultsProgress.remaining}
        //                   matches remaining to be checked in.
        //                 `}</span>
        //                 <strong>Once the round is ended, it cannot be repeated!</strong>
        //               </>
        //             ),
        //             confirmLabel: 'End Round',
        //             onConfirm: () => endTournamentRound({ id: tournament._id }),
        //           });
        //         } else {
        //           endTournamentRound({ id: tournament._id });
        //         }
        createTournamentRegistration({
          userId: user._id,
          tournamentCompetitorId: tournamentCompetitor._id,
          tournamentId: tournament._id,
        });
      },
    },
    {
      key: TournamentCompetitorActionKey.Leave,
      label: 'Leave',
      handler: () => {
        // TODO: Show warning if full && active (thus waitlist)
        if (tournamentRegistration) {
          if (activeUserIds.includes(user._id)) {
            openConfirmDialog({
              title: 'Warning!',
              description: (
                <span>{`Are you sure you want to leave ${displayName}? You are currently an active player, so leaving will leave the team short-handed.`}</span>
              ),
              onConfirm: () => deleteTournamentRegistration({
                id: tournamentRegistration._id,
              }),
              confirmLabel: 'Leave',
              intent: 'danger',
            });
          } else {
            deleteTournamentRegistration({
              id: tournamentRegistration._id,
            });
          }
        }
      },
    },
  ] : [];

  return actions.filter(({ key }) => availableActions.includes(key)).reduce((acc, { key, ...action }) => ({
    ...acc,
    [key]: action,
  }), {} as TournamentCompetitorActions);
};
