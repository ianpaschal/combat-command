export const errors = {

  // Tournament (general)
  CANNOT_ADD_ANOTHER_PLAYER: 'Cannot add another player.',
  CANNOT_ADD_COMPETITOR_TO_ACTIVE_TOURNAMENT: 'Cannot add a competitor to an on-going tournament.',
  CANNOT_DELETE_ACTIVE_TOURNAMENT: 'Cannot delete an active tournament.',
  CANNOT_DELETE_ARCHIVED_TOURNAMENT: 'Cannot delete an archived tournament.',
  CANNOT_MODIFY_ACTIVE_TOURNAMENT_COMPETITORS: 'Cannot modify competitor format for an active tournament.',
  CANNOT_MODIFY_ARCHIVED_TOURNAMENT: 'Cannot modify an archived tournament.',
  CANNOT_MODIFY_PUBLISHED_TOURNAMENT_COMPETITORS: 'Cannot modify competitor format for a published tournament.',
  CANNOT_REMOVE_ANOTHER_PLAYER: 'Cannot remove another player.',
  CANNOT_REMOVE_COMPETITOR_FROM_ACTIVE_TOURNAMENT: 'Cannot add a competitor to an on-going tournament.',

  // Tournament (specific)
  CANNOT_ADD_PAIRINGS_TO_ARCHIVED_TOURNAMENT: 'Cannot add pairings to an archived tournament.',
  CANNOT_ADD_PAIRINGS_TO_DRAFT_TOURNAMENT: 'Cannot add pairings to a draft tournament.',
  CANNOT_ADD_PAIRINGS_TO_PUBLISHED_TOURNAMENT: 'Cannot add pairings to a tournament that hasn\'t started yet.',
  CANNOT_START_ACTIVE_TOURNAMENT: 'Tournament is already running.',
  CANNOT_START_ARCHIVED_TOURNAMENT: 'Cannot start an archived tournament.',
  CANNOT_START_DRAFT_TOURNAMENT: 'Cannot start a tournament which is still a draft.',
  TEAM_ALREADY_IN_TOURNAMENT: 'A team with that name is already registered.',
  TOURNAMENT_HAS_MAX_COMPETITORS: 'This tournament cannot field more competitors.',
  USER_ALREADY_IN_TOURNAMENT: 'A user with that ID is already registered.',
  USER_NOT_TOURNAMENT_ORGANIZER: 'User is not an organizer for this tournament.',
  USER_NOT_TOURNAMENT_PLAYER: 'User is not a player in this tournament.',
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
  
  // Rankings
  TOURNAMENT_RANKINGS_PAIRING_MISSING_COMPETITOR: {
    message: 'Cannot calculate tournament rankings!',
    additionalInfo: 'One or more pairings are missing a competitor!',
  },
  TOURNAMENT_RANKINGS_MATCH_RESULT_MISSING_PLAYER: {
    message: 'Cannot calculate tournament rankings!',
    additionalInfo: 'One or more match results are missing a player!',
  },
  TOURNAMENT_RANKINGS_AVERAGE_0_DENOMINATOR: {
    message: 'Cannot calculate tournament rankings!',
    additionalInfo: 'Attempted to average results by 0!',
  },
};

export function getErrorMessage(code: keyof typeof errors): { message: string, code: string } {
  const message = errors[code];
  if (typeof message !== 'string') {
    return {
      ...message,
      code,
    };
  }
  return {
    message,
    code,
  };
}
