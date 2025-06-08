export const errors = {

  // Tournament (general)
  CANNOT_ADD_ANOTHER_PLAYER: 'Cannot add another player.',
  CANNOT_ADD_COMPETITOR_TO_ACTIVE_TOURNAMENT: 'Cannot add a competitor to an on-going tournament.',
  ONLY_ORGANIZER_CAN_TOGGLE_COMPETITOR_ACTIVE: 'Only a tournament organizer can change a competitor\'s check-in status.',
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

  // Tournament Lifecycle
  CANNOT_CLOSE_ROUND_ON_ARCHIVED_TOURNAMENT: 'Cannot close a round on an archived tournament.',
  CANNOT_CLOSE_ROUND_ON_DRAFT_TOURNAMENT: 'Cannot close a round on a tournament which is still a draft.',
  CANNOT_CLOSE_ROUND_ON_PUBLISHED_TOURNAMENT: 'Cannot close a round on a tournament which has not started.',
  CANNOT_OPEN_ROUND_ON_ARCHIVED_TOURNAMENT: 'Cannot open a round on an archived tournament.',
  CANNOT_OPEN_ROUND_ON_DRAFT_TOURNAMENT: 'Cannot open a round on a tournament which is still a draft.',
  CANNOT_OPEN_ROUND_ON_PUBLISHED_TOURNAMENT: 'Cannot open a round on a tournament which has not started.',
  TOURNAMENT_ALREADY_PUBLISHED: 'Tournament is already published.',
  TOURNAMENT_ALREADY_ACTIVE: 'Tournament is already running.',
  TOURNAMENT_ALREADY_ARCHIVED: 'Tournament is already archived.',
  CANNOT_START_ARCHIVED_TOURNAMENT: 'Cannot start an archived tournament.',
  CANNOT_START_DRAFT_TOURNAMENT: 'Cannot start a tournament which is still a draft.',
  CANNOT_PUBLISH_ARCHIVED_TOURNAMENT: 'Cannot publish an archived tournament.',
  CANNOT_PUBLISH_ACTIVE_TOURNAMENT: 'Cannot publish a tournament which is already active.',
  CANNOT_END_PUBLISHED_TOURNAMENT: 'Cannot end a tournament which has not started.',
  CANNOT_END_DRAFT_TOURNAMENT: 'Cannot end a tournament which is still a draft.',
  TOURNAMENT_ALREADY_HAS_OPEN_ROUND: 'Tournament already has an open round.',
  TOURNAMENT_DOES_NOT_HAVE_OPEN_ROUND: 'Tournament does not have a currently open round.',

  TEAM_ALREADY_IN_TOURNAMENT: 'A team with that name is already registered.',
  TOURNAMENT_HAS_MAX_COMPETITORS: 'This tournament cannot field more competitors.',
  USER_ALREADY_IN_TOURNAMENT: 'A user with that ID is already registered.',
  USER_NOT_TOURNAMENT_ORGANIZER: 'User is not an organizer for this tournament.',
  USER_NOT_TOURNAMENT_PLAYER: 'User is not a player in this tournament.',
  INACTIVE_TOURNAMENT_CANNOT_USE_TIMERS: 'Tournament is not active or does not have a current round.',
  CANNOT_ADVANCE_INACTIVE_TOURNAMENT: 'Cannot advance tournament which is not active to the next round.',
  CANNOT_END_NON_EXISTENT_TOURNAMENT_ROUND: 'Cannot end tournament round which is not ongoing.',
  TOURNAMENT_TIMER_ALREADY_PAUSED: 'Tournament timer is already paused.',
  TOURNAMENT_TIMER_ALREADY_RUNNING: 'Tournament timer is already running.',
  TOURNAMENT_TIMER_ALREADY_EXISTS: 'Tournament already has a timer for this round.',
  CANNOT_SUBSTITUTE_ONLY_ONE_PLAYER: 'Cannot substitute only one player.',
  INVALID_PAIRING_LENGTH: 'foo',

  // Missing docs
  TOURNAMENT_COMPETITOR_NOT_FOUND: 'Could not find a competitor with that ID.',
  TOURNAMENT_CONTAINING_COMPETITOR_NOT_FOUND: 'Could not find a tournament containing this competitor.',
  TOURNAMENT_NOT_FOUND: 'Could not find a tournament with that ID.',
  TOURNAMENT_PAIRING_NOT_FOUND: 'Could not find a pairing with that ID.',
  TOURNAMENT_TIMER_NOT_FOUND: 'Could not find a tournament timer for that tournament and round.',
  USER_NOT_FOUND: 'Could not find a user with that ID.',

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

  // Pairings
  NO_VALID_PAIRINGS_POSSIBLE: 'No valid pairing result possible.',
  NO_VALID_PAIRINGS_POSSIBLE_WITHOUT_REPEAT: 'No valid pairing result possible without allowing a repeat.',
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
