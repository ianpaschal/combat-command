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
  subject: Tournament,
): Record<TournamentActionKey, Action> => [

  // CRUD
  useDeleteAction(subject),
  useEditAction(subject),

  // Lifecycle
  usePublishAction(subject),
  useStartAction(subject),
  useConfigureRoundAction(subject),
  useStartRoundAction(subject),
  useUndoStartRoundAction(subject),
  useSubmitMatchResultAction(subject),
  useEndRoundAction(subject),
  // useUndoEndRoundAction(subject), // TODO
  useEndAction(subject),
  // useEndAction(subject), // TODO

  // Edge case: Creating a different type of entity, linked to this entity (Add Player & Join):
  useAddPlayerAction(subject),
  useJoinAction(subject),

  // Edge case: Deleting a different type of entity, via this entity (Leave):
  useLeaveAction(subject),

].filter((a) => a !== null).reduce((acc, { key, ...action }) => ({
  ...acc,
  [key]: action,
}), {} as Record<TournamentActionKey, Action>);
