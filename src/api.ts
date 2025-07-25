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

// Static Data & Interfaces (Flames of War 4th Edition)

// Battle Plans
export {
  type FowV4BattlePlan,
  fowV4BattlePlanOptions,
} from '../convex/static/fowV4/fowV4BattlePlan';

// Dynamic Points Versions
export {
  type FowV4DynamicPointsVersion,
  type FowV4DynamicPointsVersionId,
  fowV4DynamicPointsVersionOptions,
} from '../convex/static/fowV4/dynamicPointsVersions';

// Eras
export {
  type FowV4Era,
  type FowV4EraId,
  fowV4EraOptions,
} from '../convex/static/fowV4/eras';

// Factions
export {
  type FowV4Faction,
  type FowV4FactionId,
  fowV4FactionOptions,
} from '../convex/static/fowV4/factions';

// Lessons From the Front Versions
export {
  type FowV4LessonsFromTheFrontVersion,
  type FowV4LessonsFromTheFrontVersionId,
  fowV4LessonsFromTheFrontVersionOptions,
} from '../convex/static/fowV4/lessonsFromTheFrontVersions';

// Match Outcome Types
export type { FowV4MatchOutcomeType } from '../convex/_model/fowV4/fowV4MatchOutcomeType';
export { fowV4MatchOutcomeTypeValues } from '../convex/_model/fowV4/fowV4MatchOutcomeType';

// Ranking Factors
export {
  type FowV4RankingFactor,
  fowV4RankingFactorDisplayNames,
  fowV4RankingFactorOptions,
  fowV4RankingFactorShortNames,
} from '../convex/static/fowV4/fowV4RankingFactors';

// Missions
export { getMission } from '../convex/_model/fowV4/getMission';
export type { FowV4MissionId } from '../convex/static/fowV4/missionPacks';
export type { FowV4Mission } from '../convex/static/fowV4/missionPacks.types';

// Mission Packs
export { getMissionPack } from '../convex/_model/fowV4/getMissionPack';
export type { FowV4MissionPackId } from '../convex/static/fowV4/missionPacks';
export { fowV4MissionPackOptions } from '../convex/static/fowV4/missionPacks';
export type { FowV4MissionPack } from '../convex/static/fowV4/missionPacks.types';

// Mission Matrixes
export type { FowV4MissionMatrixId } from '../convex/static/fowV4/missionPacks';
export {
  getFowV4MissionMatrixesByMissionPackId,
  getFowV4MissionMatrixOptionsByMissionPackId,
  getFowV4MissionsByMissionPackId,
} from '../convex/static/fowV4/missionPacks';
export type { FowV4MissionMatrix } from '../convex/static/fowV4/missionPacks.types';
