import { useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { TournamentActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialogData } from '~/components/ConfirmationDialog';
import { Warning } from '~/components/generic/Warning';
import { useMatchResultCreateDialog } from '~/components/MatchResultCreateDialog';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useGetTournamentPairings } from '~/services/tournamentPairings';
import {
  useDeleteTournament,
  useEndTournament,
  useEndTournamentRound,
  useGetTournamentOpenRound,
  usePublishTournament,
  useStartTournament,
  useStartTournamentRound,
} from '~/services/tournaments';
import { PATHS } from '~/settings';
import { validateConfigureRound } from './utils/validateConfigureRound';
import {
  Action,
  TournamentActions,
  TournamentActionsContext,
} from './TournamentActionsProvider.context';

export const useTournamentActions = () => {
  const context = useContext(TournamentActionsContext);
  if (!context) {
    throw Error('useTournamentActions must be used within a <TournamentActionsProvider />!');
  }
  return context;
};

type ActionDefinition = Action & {
  key: TournamentActionKey;
  available: boolean;
};

export const useActions = (openDialog: (data?: ConfirmationDialogData) => void): TournamentActions => {
  const user = useAuth();
  const tournament = useTournament();

  // ---- HANDLERS ----
  const navigate = useNavigate();
  const configureTournamentRound = (): void => {
    navigate(generatePath(PATHS.tournamentPairings, { id: tournament._id }));
  };
  const { open: openMatchResultCreateDialog } = useMatchResultCreateDialog();
  const { mutation: deleteTournament } = useDeleteTournament({
    onSuccess: (): void => {
      toast.success(`${tournament.title} deleted!`);
      navigate(PATHS.tournaments);
    },
  });

  const { mutation: publishTournament } = usePublishTournament({
    onSuccess: (): void => {
      toast.success(`${tournament.title} is now published!`);
    },
  });

  const { mutation: startTournament } = useStartTournament({
    onSuccess: (): void => {
      toast.success(`${tournament.title} started!`);
    },
  });

  const { mutation: startTournamentRound } = useStartTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${currentRoundLabel} started!`);
    },
  });

  const { mutation: endTournament } = useEndTournament({
    onSuccess: (): void => {
      toast.success(`${tournament.title} completed!`);
    },
  });

  const { mutation: endTournamentRound } = useEndTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${currentRoundLabel} completed!`);
    },
  });

  // ---- DATA ----
  const { data: nextRoundPairings } = useGetTournamentPairings({
    tournamentId: tournament._id,
    round: tournament.nextRound,
  });
  const { data: openRound } = useGetTournamentOpenRound({
    id: tournament._id,
  });
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournament({
    tournamentId: tournament._id,
  });
  const isOrganizer = !!user && tournament.organizerUserIds.includes(user._id);
  const isBetweenRounds = tournament.status === 'active' && !openRound;
  const hasNextRound = tournament.nextRound !== undefined;

  // Labels for messages:
  const nextRoundLabel = (tournament.nextRound ?? 0) + 1;
  const currentRoundLabel = (tournament.currentRound ?? 0) + 1;
  const remainingRoundsLabel = tournament.roundCount - ((tournament.lastRound ?? -1) + 1);

  // ---- ACTIONS ----
  const actions: ActionDefinition[] = [
    {
      key: TournamentActionKey.Edit,
      label: 'Edit',
      available: isOrganizer && ['draft', 'published'].includes(tournament.status),
      handler: () => navigate(generatePath(PATHS.tournamentEdit, { id: tournament._id })),
    },
    {
      key: TournamentActionKey.Delete,
      label: 'Delete',
      available: isOrganizer && tournament.status === 'draft',
      handler: () => {
        // TODO: Implement confirmation dialog
        deleteTournament({ id: tournament._id });
      },
    },
    {
      key: TournamentActionKey.Publish,
      label: 'Publish',
      available: isOrganizer && tournament.status === 'draft',
      handler: () => {
        // TODO: Implement confirmation dialog
        publishTournament({ id: tournament._id });
      },
    },
    {
      key: TournamentActionKey.Start,
      label: 'Start',
      available: isOrganizer && tournament.status === 'published',
      handler: () => {
        // TODO: Implement confirmation dialog
        startTournament({ id: tournament._id });
      },
    },
    {
      key: TournamentActionKey.ConfigureRound,
      label: `Configure Round ${nextRoundLabel}`,
      available: isOrganizer && isBetweenRounds && hasNextRound && nextRoundPairings?.length === 0,
      handler: () => {
        const { errors, warnings } = validateConfigureRound(tournament, tournamentCompetitors);
        if (errors.length) {
          return toast.error('Cannot Configure Round', {
            description: errors,
          });
        }
        if (warnings.length) {
          openDialog({
            title: `Configure Round ${nextRoundLabel}`,
            children: warnings.map((warning, i) => (
              <Warning key={i}>{warning}</Warning>
            )),
            confirmLabel: 'Proceed',
            onConfirm: () => configureTournamentRound(),
          });
        } else {
          configureTournamentRound();
        }
      },
    },
    {
      key: TournamentActionKey.StartRound,
      label: `Start Round ${nextRoundLabel}`,
      available: isOrganizer && isBetweenRounds && hasNextRound && (nextRoundPairings ?? []).length > 0,
      handler: () => startTournamentRound({ id: tournament._id }),
    },
    {
      key: TournamentActionKey.SubmitMatchResult,
      label: 'Submit Match Result',
      available: !!openRound,
      handler: () => openMatchResultCreateDialog(),
    },
    {
      key: TournamentActionKey.EndRound,
      label: `End Round ${currentRoundLabel}`,
      available: isOrganizer && !!openRound,
      handler: () => {
        if (openRound && openRound.matchResultsProgress.remaining > 0) {
          openDialog({
            title: 'Warning!',
            description: (
              <>
                <span>{`
                  Are you sure you want to end round ${currentRoundLabel}?
                  There are still ${openRound.matchResultsProgress.remaining}
                  matches remaining to be checked in.
                `}</span>
                <strong>Once the round is ended, it cannot be repeated!</strong>
              </>
            ),
            confirmLabel: 'End Round',
            onConfirm: () => endTournamentRound({ id: tournament._id }),
          });
        } else {
          endTournamentRound({ id: tournament._id });
        }
      },
    },
    {
      key: TournamentActionKey.End,
      label: 'End Tournament',
      available: isOrganizer && isBetweenRounds,
      handler: () => {
        if (tournament.nextRound !== undefined && tournament.nextRound < tournament.roundCount) {
          openDialog({
            title: 'Warning!',
            description: (
              <>
                <span>{`Are you sure you want to end ${tournament.title}? There are still ${remainingRoundsLabel} rounds remaining.`}</span>
                <strong>Once the tournament is ended, it cannot be restarted!</strong>
              </>
            ),
            onConfirm: () => endTournament({ id: tournament._id }),
            confirmLabel: 'End Tournament',
            intent: 'danger',
          });
        } else {
          endTournament({ id: tournament._id });
        }
      },
    },
  ];

  return actions.filter(({ available }) => available).reduce((acc, { key, ...action }) => ({
    ...acc,
    [key]: action,
  }), {} as TournamentActions);
};
