import { useContext } from 'react';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { Action } from '~/components/ContextMenu/ContextMenu.types';
import { useLeaveAction } from '~/components/TournamentRegistrationProvider/actions/useLeaveAction';
import { useDeleteAction } from './actions/useDeleteAction';
import { useToggleActiveAction } from './actions/useToggleActiveAction';
import { tournamentRegistrationContext } from './TournamentRegistrationProvider.context';

export const useTournamentRegistration = () => {
  const context = useContext(tournamentRegistrationContext);
  if (!context) {
    throw Error('useTournamentRegistration must be used within a <TournamentRegistrationProvider/>!');
  }
  return context;
};

export const useActions = (
  subject: TournamentRegistration,
): Record<TournamentRegistrationActionKey, Action> => [
  useToggleActiveAction(subject),
  useLeaveAction(subject),
  useDeleteAction(subject),
].filter((a) => a !== null).reduce((acc, { key, ...action }) => ({
  ...acc,
  [key]: action,
}), {} as Record<TournamentRegistrationActionKey, Action>);
