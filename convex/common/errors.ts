export const errors = {

  // Tournament (general)
  CANNOT_ADD_ANOTHER_PLAYER: 'Cannot remove another player.',
  CANNOT_ADD_COMPETITOR_TO_ACTIVE_TOURNAMENT: 'Cannot add a competitor to an on-going tournament.',
  CANNOT_DELETE_ACTIVE_TOURNAMENT: 'Cannot delete an active tournament.',
  CANNOT_DELETE_ARCHIVED_TOURNAMENT: 'Cannot delete an archived tournament.',
  CANNOT_MODIFY_ACTIVE_TOURNAMENT_COMPETITORS: 'Cannot modify competitor format for an active tournament.',
  CANNOT_MODIFY_ARCHIVED_TOURNAMENT: 'Cannot modify an archived tournament.',
  CANNOT_MODIFY_PUBLISHED_TOURNAMENT_COMPETITORS: 'Cannot modify competitor format for a published tournament.',
  CANNOT_REMOVE_ANOTHER_PLAYER: 'Cannot remove another player.',
  CANNOT_REMOVE_COMPETITOR_FROM_ACTIVE_TOURNAMENT: 'Cannot add a competitor to an on-going tournament.',

  // Tournament (specific)
  TEAM_ALREADY_IN_TOURNAMENT: 'A team with that name is already registered.',
  USER_ALREADY_IN_TOURNAMENT: 'A user with that ID is already registered.',
  TOURNAMENT_HAS_MAX_COMPETITORS: 'This tournament cannot field more competitors.',

  // Missing docs
  TOURNAMENT_COMPETITOR_NOT_FOUND: 'Could not find a competitor with that ID.',
  TOURNAMENT_CONTAINING_COMPETITOR_NOT_FOUND: 'Could not find a tournament containing this competitor.',
  TOURNAMENT_NOT_FOUND: 'Could not find a tournament with that ID.',
  TOURNAMENT_PAIRING_NOT_FOUND: 'Could not find a pairing with that ID.',

  // General
  USER_NOT_AUTHENTICATED: 'Authentication required!',
};

export function getErrorMessage(code: keyof typeof errors): { message: string, code: string } {
  const message = errors[code];
  return {
    message,
    code,
  };
}
