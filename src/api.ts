import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

// Re-export API for usage in services
export { api };

// Match Result Comments
export {
  type DeepMatchResultComment as MatchResultComment,
  type MatchResultCommentId,
} from '../convex/_model/matchResultComments';

// Match Result Likes
export {
  type DeepMatchResultLike as MatchResultLike,
  type MatchResultLikeId,
} from '../convex/_model/matchResultLikes';

// Match Results
export {
  type DeepFowV4MatchResultDetails as FowV4MatchResultDetails,
  type DeepMatchResult as MatchResult,
  type MatchResultId,
} from '../convex/_model/matchResults';

// Photos
export type PhotoId = Id<'photos'>;

// Storage
export type StorageId = Id<'_storage'>;

export { VisibilityLevel } from '../convex/_model/common/types';

// Tournament Competitors
export {
  type DeepTournamentCompetitor as TournamentCompetitor,
  type TournamentCompetitorId,
} from '../convex/_model/tournamentCompetitors';

// Tournament Organizers
export {
  type TournamentOrganizer,
  type TournamentOrganizerId,
} from '../convex/_model/tournamentOrganizers';

// Tournament Pairings
export {
  type ShallowTournamentPairing,
  type TournamentPairingDeep as TournamentPairing,
  type TournamentPairingId,
} from '../convex/_model/tournamentPairings';

// Tournament Registrations
export {
  type TournamentRegistration,
  type TournamentRegistrationId,
} from '../convex/_model/tournamentRegistrations';

// Tournament Timers
export {
  convertRoundStructureToMs,
  type TournamentRoundStructure,
  type TournamentTimerDeep as TournamentTimer,
  type TournamentTimerId,
} from '../convex/_model/tournamentTimers';

// Tournaments
export {
  type TournamentDeep as Tournament,
  TournamentActionKey,
  type TournamentEditableFields,
  type TournamentId,
} from '../convex/_model/tournaments';

// Users
export {
  themeOptions,
  type ThemePreference,
  themePreference,
} from '../convex/_model/common/themes';
export {
  type CurrentUser,
  type LimitedUser as User,
  type UserId,
} from '../convex/_model/users';

// TODO: Move around...
export type {
  DraftTournamentPairing,
} from '../convex/_model/tournamentPairings';
export type {
  TournamentCompetitorRanked,
} from '../convex/_model/tournaments';
