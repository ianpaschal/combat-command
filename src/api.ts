import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

// Re-export API for usage in services
export { api };

// Common
export type {
  RankingFactor,
  TournamentStatus,
} from '../convex/_model/common/types';
export {
  VisibilityLevel,
} from '../convex/_model/common/VisibilityLevel';
export {
  type LeagueRanking,
} from '../convex/_model/leagueRankings';
export {
  type League,
  type LeagueId,
  type LeagueStatus,
  type RankedLeagueUser,
} from '../convex/_model/leagues';

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
  type DeepMatchResult as MatchResult,
  type MatchResultId,
} from '../convex/_model/matchResults';

// Photos
export type PhotoId = Id<'photos'>;

// Storage
export type StorageId = Id<'_storage'>;

// Tournament Competitors
export {
  type ScoreAdjustment,
  type DeepTournamentCompetitor as TournamentCompetitor,
  TournamentCompetitorActionKey,
  type TournamentCompetitorId,
} from '../convex/_model/tournamentCompetitors';

// Tournament Organizers
export {
  type TournamentOrganizer,
  type TournamentOrganizerId,
} from '../convex/_model/tournamentOrganizers';

// Tournament Pairings
export {
  type DraftTournamentPairing,
  type ShallowTournamentPairing,
  type TournamentPairingDeep as TournamentPairing,
  type TournamentPairingId,
} from '../convex/_model/tournamentPairings';

// Tournament Registrations
export {
  type TournamentRegistration,
  TournamentRegistrationActionKey,
  type TournamentRegistrationFormData,
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
  getDisplayName as getTournamentDisplayName,
  type TournamentDeep as Tournament,
  TournamentActionKey,
  type TournamentEditableFields,
  type TournamentFilterParams,
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
