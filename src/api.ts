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

// Match Results
export type CreateMatchResultInput = typeof api.matchResults.createMatchResult.createMatchResult._args;
export type FetchMatchResultResponse = typeof api.matchResults.fetchMatchResult.fetchMatchResult._returnType;
export type FetchMatchResultListResponse = typeof api.matchResults.fetchMatchResultList.fetchMatchResultList._returnType;
export type FetchMatchResultListResponseItem = FetchMatchResultListResponse[number];

// Tournament Competitors
// export type FetchTournamentCompetitorListResponse = typeof api.tournamentCompetitors.fetchTournamentCompetitor.fetchTournamentCompetitor._returnType;
// export type FetchTournamentCompetitorListResponseItem = FetchTournamentCompetitorListResponse[number];
export type FetchTournamentCompetitorResponse = typeof api.tournamentCompetitors.fetchTournamentCompetitor.fetchTournamentCompetitor._returnType;
// export type TournamentCompetitor = FetchTournamentCompetitorResponse | FetchTournamentCompetitorListResponseItem;

// Tournament Pairings
export type FetchTournamentPairingListResponse = typeof api.tournamentPairings.fetchTournamentPairingList.fetchTournamentPairingList._returnType;
export type FetchTournamentPairingListResponseItem = FetchTournamentPairingListResponse[number];
