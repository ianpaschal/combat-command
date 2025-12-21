import { useContext } from 'react';

import { Tournament, TournamentActionKey } from '~/api';
import { Action } from '~/components/ContextMenu/ContextMenu.types';
import { useAddPlayerAction } from './actions/useAddPlayerAction';
import { useConfigureRoundAction } from './actions/useConfigureRoundAction';
import { useDeleteAction } from './actions/useDeleteAction';
import { useEditAction } from './actions/useEditAction';
import { useEndAction } from './actions/useEndAction';
import { useEndRoundAction } from './actions/useEndRoundAction';
import { useJoinAction } from './actions/useJoinAction';
import { useLeaveAction } from './actions/useLeaveAction';
import { usePublishAction } from './actions/usePublishAction';
import { useStartAction } from './actions/useStartAction';
import { useStartRoundAction } from './actions/useStartRoundAction';
import { useSubmitMatchResultAction } from './actions/useSubmitMatchResultAction';
import { useUndoStartRoundAction } from './actions/useUndoStartRoundAction';
import { tournamentContext } from './TournamentProvider.context';

export const useTournament = () => {
  const context = useContext(tournamentContext);
  if (!context) {
    throw Error('useTournament must be used within a <TournamentProvider/>!');
  }
  return context;
};

export const useActions = (
  tournament: Tournament,
): Record<TournamentActionKey, Action> => [
  useAddPlayerAction(tournament),
  useConfigureRoundAction(tournament),
  useDeleteAction(tournament),
  useEditAction(tournament),
  useEndAction(tournament),
  useEndRoundAction(tournament),
  useJoinAction(tournament),
  useLeaveAction(tournament),
  usePublishAction(tournament),
  useStartAction(tournament),
  useStartRoundAction(tournament),
  useSubmitMatchResultAction(tournament),
  useUndoStartRoundAction(tournament),
].filter((a) => a !== null).reduce((acc, { key, ...action }) => ({
  ...acc,
  [key]: action,
}), {} as Record<TournamentActionKey, Action>);
