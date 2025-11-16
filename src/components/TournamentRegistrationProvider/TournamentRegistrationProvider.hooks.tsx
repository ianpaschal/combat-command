import { useContext, useState } from 'react';
import { useDialogManager } from '@ianpaschal/combat-command-components';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { toast } from '~/components/ToastProvider';
import { useTournamentCompetitor } from '~/components/TournamentCompetitorProvider/TournamentCompetitorProvider.hooks';
import { useTournament } from '~/components/TournamentProvider';
import { useDeleteTournamentRegistration, useToggleTournamentRegistrationActive } from '~/services/tournamentRegistrations';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';
import {
  ActionDefinition,
  TournamentRegistrationActions,
  TournamentRegistrationContext,
} from './TournamentRegistrationProvider.context';

export const useTournamentRegistration = () => {
  const context = useContext(TournamentRegistrationContext);
  if (!context) {
    throw Error('useTournamentRegistration must be used within a <TournamentRegistrationProvider />!');
  }
  return context;
};

export const useActions = (
  tournamentRegistration: TournamentRegistration,
): TournamentRegistrationActions => {
  const user = useAuth();
  const { open, close } = useDialogManager();
  const [confirmationDialogId, setConfirmationDialogId] = useState<string>('');
  const tournament = useTournament(); // TODO: Support fetching tournament by ID if it doesn't exist
  const { tournamentCompetitor } = useTournamentCompetitor();
  const { availableActions } = tournamentRegistration;
  const isSelf = user?._id === tournamentRegistration.userId;

  // Labels for messages:
  const tournamentDisplayName = getTournamentDisplayName(tournament);
  const competitorDisplayName = getTournamentCompetitorDisplayName(tournamentCompetitor);
  const registrationDisplayName = isSelf ? 'You' : tournamentRegistration.user?.displayName ?? 'Unknown Player';
  const leaveLabel = tournament.useTeams ? competitorDisplayName : tournamentDisplayName;

  const getLeaveSuccessMessage = (wasLast: boolean): string => {
    if (isSelf) {
      if (tournament.useTeams && wasLast) {
        return `${competitorDisplayName} has left ${tournamentDisplayName}.`;
      } else {
        return `${registrationDisplayName} have left ${leaveLabel}.`;
      }
    } else {
      if (tournament.useTeams && wasLast) {
        return `${competitorDisplayName} was removed from ${tournamentDisplayName}.`;
      } else {
        return `${registrationDisplayName} was removed from ${leaveLabel}.`;
      }
    }
  };

  // ---- HANDLERS ---
  // Delete
  const { mutation: deleteTournamentRegistration, loading: deleteLoading } = useDeleteTournamentRegistration({
    onSuccess: (response): void => {
      toast.success(getLeaveSuccessMessage(response.wasLast));
      close(confirmationDialogId);
    },
  });

  // ToggleActive
  const { mutation: toggleActive } = useToggleTournamentRegistrationActive({
    onSuccess: (active): void => {
      toast.success(`${isSelf ? 'You are' : `${registrationDisplayName} is`} now ${active ? 'active' : 'inactive'}.`);
    },
  });

  // ---- ACTIONS ----
  const actions: ActionDefinition[] = user ? [
    {
      key: TournamentRegistrationActionKey.Delete,
      label: 'Remove',
      handler: () => {
        setConfirmationDialogId(open({
          title: 'Warning!',
          content: (
            <span>{`Are you sure you want to remove ${registrationDisplayName}?`}</span>
          ),
          actions: [
            {
              intent: 'danger',
              onClick: async () => await deleteTournamentRegistration({ id: tournamentRegistration._id }),
              text: 'Remove',
              loading: deleteLoading,
            },
          ],
        }));
      },
    },
    {
      key: TournamentRegistrationActionKey.Leave,
      label: 'Leave',
      handler: () => {
        setConfirmationDialogId(open({
          title: 'Warning!',
          content: (
            <span>{`Are you sure you want to leave ${leaveLabel}?`}</span>
          ),
          actions: [
            {
              intent: 'danger',
              onClick: async () => await deleteTournamentRegistration({ id: tournamentRegistration._id }),
              text: 'Leave',
              loading: deleteLoading,
            },
          ],
        }));
      },
    },
    {
      key: TournamentRegistrationActionKey.ToggleActive,
      label: 'Toggle Active',
      handler: () => {
        toggleActive({ id: tournamentRegistration._id });
      },
    },
  ] : [];

  return actions.filter(({ key }) => availableActions.includes(key)).reduce((acc, { key, ...action }) => ({
    ...acc,
    [key]: action,
  }), {} as TournamentRegistrationActions);
};
