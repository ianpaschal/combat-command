import { api } from '../convex/_generated/api';
import { Doc, Id } from '../convex/_generated/dataModel';

// Re-export API for usage in services
export { api };

// Storage
export type StorageId = Id<'_storage'>;

// Match Result Comments
export type AddMatchResultCommentInput = typeof api.matchResultComments.mutations.addMatchResultComment._args;
export type GetMatchResultCommentResponse = typeof api.matchResultComments.queries.getMatchResultComment._returnType;
export type GetMatchResultCommentsByMatchResultIdResponse = typeof api.matchResultComments.queries.getMatchResultCommentsByMatchResultId._returnType;
export type GetMatchResultCommentsByUserIdResponse = typeof api.matchResultComments.queries.getMatchResultCommentsByUserId._returnType;
export type MatchResultComment = GetMatchResultCommentResponse | GetMatchResultCommentsByMatchResultIdResponse[number] | GetMatchResultCommentsByUserIdResponse[number];
export type MatchResultCommentId = Id<'matchResultComments'>;

// Match Result Likes
export type GetMatchResultLikeResponse = typeof api.matchResultLikes.queries.getMatchResultLike._returnType;
export type GetMatchResultLikesByMatchResultIdResponse = typeof api.matchResultLikes.queries.getMatchResultLikesByMatchResultId._returnType;
export type GetMatchResultLikesByUserIdResponse = typeof api.matchResultLikes.queries.getMatchResultLikesByUserId._returnType;
export type MatchResultLike = GetMatchResultLikeResponse | GetMatchResultLikesByMatchResultIdResponse[number] | GetMatchResultLikesByUserIdResponse[number];
export type MatchResultLikeId = Id<'matchResultLikes'>;
export type ToggleMatchResultLikeInput = typeof api.matchResultLikes.mutations.toggleMatchResultLike._args;

// Match Results
export type FetchMatchResultListResponse = typeof api.matchResults.fetchMatchResultList.fetchMatchResultList._returnType;
export type FetchMatchResultListResponseItem = FetchMatchResultListResponse[number];
export type FetchMatchResultResponse = typeof api.matchResults.fetchMatchResult.fetchMatchResult._returnType;
export type MatchResult = FetchMatchResultListResponse[number];
export type MatchResultId = Id<'matchResults'>;

// Photos
export type PhotoId = Id<'photos'>;

// Tournament Competitors
export type FetchTournamentCompetitorListResponse = typeof api.tournamentCompetitors.getTournamentCompetitorList._returnType;
export type FetchTournamentCompetitorListResponseItem = FetchTournamentCompetitorListResponse[number];
export type FetchTournamentCompetitorResponse = typeof api.tournamentCompetitors.getTournamentCompetitor._returnType;
export type TournamentCompetitor = FetchTournamentCompetitorListResponseItem;
export type TournamentCompetitorId = Id<'tournamentCompetitors'>;

// Tournament Pairings
export type TournamentPairingId = Id<'tournamentPairings'>;

// Tournaments
export type CreateTournamentArgs = typeof api.tournaments.createTournament._args;
export type FetchTournamentListResponse = typeof api.tournaments.getTournamentList._returnType;
export type FetchTournamentListResponseItem = FetchTournamentListResponse[number];
export type FetchTournamentResponse = typeof api.tournaments.getTournament._returnType;
export type Tournament = FetchTournamentListResponseItem;
export type TournamentId = Id<'tournaments'>;

export type Location = Tournament['location'];

// Users
export type User = Doc<'users'> & {
  avatarUrl?: string;
};
export type UserId = Id<'users'>;
export type UpdateUserInput = typeof api.users.updateUser.updateUser._args;
export type UpdateUserResponse = typeof api.users.updateUser.updateUser._returnType;

// Static Data & Interfaces (Common)
export {
  type CurrencyCode,
  currencyCodeOptions,
} from '../convex/static/currencyCodes';
export {
  type GameSystemId,
  gameSystemOptions,
  gameSystems,
  getGameSystemDisplayName,
} from '../convex/static/gameSystems';
export {
  type TournamentPairingMethod,
  tournamentPairingMethodDisplayNames,
  tournamentPairingMethodOptions,
} from '../convex/static/tournamentPairingMethods';

// TODO: Move around...
export {
  checkPairingIsValid,
} from '../convex/_model/tournamentPairings/helpers/checkPairingIsValid';
export {
  type DraftPairing,
  type PairingResult,
  type RankedCompetitor,
} from '../convex/_model/tournamentPairings/helpers/pairingTypes';

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
export type { FowV4MatchOutcomeType } from '../convex/common/fowV4/fowV4MatchOutcomeType';
export { fowV4MatchOutcomeTypeValues } from '../convex/common/fowV4/fowV4MatchOutcomeType';

// Ranking Factors
export {
  type FowV4RankingFactor,
  fowV4RankingFactorOptions,
} from '../convex/static/fowV4/fowV4RankingFactors';

// Missions
export { getMission } from '../convex/common/fowV4/getMission';
export type { FowV4MissionId } from '../convex/static/fowV4/missionPacks';
export type { FowV4Mission } from '../convex/static/fowV4/missionPacks.types';

// Mission Packs
export { getMissionPack } from '../convex/common/fowV4/getMissionPack';
export type { FowV4MissionPackId } from '../convex/static/fowV4/missionPacks';
export { fowV4MissionPackOptions } from '../convex/static/fowV4/missionPacks';
export type { FowV4MissionPack } from '../convex/static/fowV4/missionPacks.types';

// Mission Matrixes
export type { FowV4MissionMatrixId } from '../convex/static/fowV4/missionPacks';
export {
  getFowV4MissionMatrixesByMissionPackId,
  getFowV4MissionMatrixOptionsByMissionPackId,
} from '../convex/static/fowV4/missionPacks';
export type { FowV4MissionMatrix } from '../convex/static/fowV4/missionPacks.types';
