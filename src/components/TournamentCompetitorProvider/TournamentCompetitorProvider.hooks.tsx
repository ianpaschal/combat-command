import { useContext } from 'react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Action } from '~/components/ContextMenu/ContextMenu.types';
import { useAddPlayerAction } from '~/components/TournamentCompetitorProvider/actions/useAddPlayerAction';
import { useJoinAction } from '~/components/TournamentCompetitorProvider/actions/useJoinAction';
import { useToggleActiveAction } from '~/components/TournamentCompetitorProvider/actions/useToggleActiveAction';
import { useLeaveAction } from '~/components/TournamentRegistrationProvider';
import { useGetTournamentRegistrationByTournamentUser } from '~/services/tournamentRegistrations';
import { useDeleteAction } from './actions/useDeleteAction';
import { useEditAction } from './actions/useEditAction';
import { tournamentCompetitorContext } from './TournamentCompetitorProvider.context';

export const useTournamentCompetitor = () => {
  const context = useContext(tournamentCompetitorContext);
  if (!context) {
    throw Error('useTournamentCompetitor must be used within a <TournamentCompetitorProvider/>!');
  }
  return context;
};

export const useActions = (
  subject: TournamentCompetitor,
): Record<TournamentCompetitorActionKey, Action> => {
  const currentUser = useAuth();
  const { data: tournamentRegistration } = useGetTournamentRegistrationByTournamentUser(currentUser ? {
    userId: currentUser._id,
    tournamentId: subject.tournamentId,
  } : 'skip');

  return [

    // CRUD
    useDeleteAction(subject),
    useEditAction(subject),

    // Special Actions
    useToggleActiveAction(subject),

    // Edge case: Creating a different type of entity, linked to this entity (Add Player & Join):
    useAddPlayerAction(subject),
    useJoinAction(subject),

    // Edge case: Deleting a different type of entity, via this entity (Leave):
    // FIXME: This shouldn't be a TournamentRegistrationActionKey. Copy AddPlayer/Join pattern.
    useLeaveAction(tournamentRegistration ?? null), // Self (Leave)

  ].filter((a) => a !== null).reduce((acc, { key, ...action }) => ({
    ...acc,
    [key]: action,
  }), {} as Record<TournamentCompetitorActionKey, Action>);
};
