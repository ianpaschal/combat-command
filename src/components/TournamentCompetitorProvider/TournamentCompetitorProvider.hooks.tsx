import { useContext } from 'react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { Action } from '~/components/ContextMenu/ContextMenu.types';
import { useToggleActiveAction } from '~/components/TournamentCompetitorProvider/actions/useToggleActiveAction';
import { useAddPlayerAction } from './actions/useAddPlayerAction';
import { useDeleteAction } from './actions/useDeleteAction';
import { useEditAction } from './actions/useEditAction';
import { useJoinAction } from './actions/useJoinAction';
import { useLeaveAction } from './actions/useLeaveAction';
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
): Record<TournamentCompetitorActionKey, Action> => [
  useAddPlayerAction(subject),
  useDeleteAction(subject),
  useEditAction(subject),
  useJoinAction(subject),
  useLeaveAction(subject),
  useToggleActiveAction(subject),
].filter((a) => a !== null).reduce((acc, { key, ...action }) => ({
  ...acc,
  [key]: action,
}), {} as Record<TournamentCompetitorActionKey, Action>);
