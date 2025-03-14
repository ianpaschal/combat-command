import { api } from '../convex/_generated/api';
import { Doc, Id } from '../convex/_generated/dataModel';
import { GameSystem } from '../convex/common/gameSystem';

export {
  api,
  type GameSystem,
};

export type User = Doc<'users'> & {
  avatarUrl?: string;
};

export type UserId = Id<'users'>;

export type StorageId = Id<'_storage'>;

export type TournamentId = Id<'tournaments'>;

export type TournamentPairingId = Id<'tournamentPairings'>;

export type FowV4MissionPackId = Id<'fowV4MissionPacks'>;

export type FowV4MissionMatrixId = Id<'fowV4MissionMatrixes'>;

export type FowV4MissionId = Id<'fowV4Missions'>;

export type UpdateUserInput = typeof api.users.updateUser.updateUser._args;

export type FetchTournamentListInput = typeof api.tournaments.fetchTournamentList.fetchTournamentList._args;

export type FetchTournamentList = typeof api.tournaments.fetchTournamentList.fetchTournamentList._returnType;

export type FetchTournamentListItem = FetchTournamentList[number];

export type FetchTournamentResponse = typeof api.tournaments.fetchTournament.fetchTournament._returnType;

// Match Result Comments
export type MatchResultCommentId = Id<'matchResultComments'>;
export type AddMatchResultCommentInput = typeof api.matchResultComments.mutations.addMatchResultComment._args;
export type GetMatchResultCommentResponse = typeof api.matchResultComments.queries.getMatchResultComment._returnType;
export type GetMatchResultCommentsByMatchResultIdResponse = typeof api.matchResultComments.queries.getMatchResultCommentsByMatchResultId._returnType;
export type GetMatchResultCommentsByUserIdResponse = typeof api.matchResultComments.queries.getMatchResultCommentsByUserId._returnType;
export type MatchResultComment = GetMatchResultCommentResponse | GetMatchResultCommentsByMatchResultIdResponse[number] | GetMatchResultCommentsByUserIdResponse[number];

// Match Result Likes
export type MatchResultLikeId = Id<'matchResultLikes'>;
export type ToggleMatchResultLikeInput = typeof api.matchResultLikes.mutations.toggleMatchResultLike._args;
export type GetMatchResultLikeResponse = typeof api.matchResultLikes.queries.getMatchResultLike._returnType;
export type GetMatchResultLikesByMatchResultIdResponse = typeof api.matchResultLikes.queries.getMatchResultLikesByMatchResultId._returnType;
export type GetMatchResultLikesByUserIdResponse = typeof api.matchResultLikes.queries.getMatchResultLikesByUserId._returnType;
export type MatchResultLike = GetMatchResultLikeResponse | GetMatchResultLikesByMatchResultIdResponse[number] | GetMatchResultLikesByUserIdResponse[number];

// Match Results
export type MatchResultId = Id<'matchResults'>;
export type CreateMatchResultInput = typeof api.matchResults.createMatchResult.createMatchResult._args;
export type UpdateMatchResultInput = typeof api.matchResults.updateMatchResult.updateMatchResult._args;
export type FetchMatchResultResponse = typeof api.matchResults.fetchMatchResult.fetchMatchResult._returnType;
export type FetchMatchResultListResponse = typeof api.matchResults.fetchMatchResultList.fetchMatchResultList._returnType;
export type FetchMatchResultListResponseItem = FetchMatchResultListResponse[number];
export type MatchResult = FetchMatchResultListResponse[number];

// Tournament Competitors
// export type FetchTournamentCompetitorListResponse = typeof api.tournamentCompetitors.fetchTournamentCompetitor.fetchTournamentCompetitor._returnType;
// export type FetchTournamentCompetitorListResponseItem = FetchTournamentCompetitorListResponse[number];
export type FetchTournamentCompetitorResponse = typeof api.tournamentCompetitors.fetchTournamentCompetitor.fetchTournamentCompetitor._returnType;
// export type TournamentCompetitor = FetchTournamentCompetitorResponse | FetchTournamentCompetitorListResponseItem;

// Tournament Pairings
export type FetchTournamentPairingListResponse = typeof api.tournamentPairings.fetchTournamentPairingList.fetchTournamentPairingList._returnType;
export type FetchTournamentPairingListResponseItem = FetchTournamentPairingListResponse[number];

// Static Data
export type { FowV4MatchOutcomeType } from '../convex/common/fowV4/fowV4MatchOutcomeType';
export { fowV4MatchOutcomeTypeValues } from '../convex/common/fowV4/fowV4MatchOutcomeType';
export { missionPacks } from '../convex/static/fowV4/missionPacks';
export type { FowV4Mission } from '../convex/static/fowV4/missionPacks.types';
export { getMission, getMissionPack } from '../convex/static/fowV4/missionPacks.utils';
