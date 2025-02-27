import { api } from '../convex/_generated/api';
import { Doc, Id } from '../convex/_generated/dataModel';

export {
  api,
};

export type User = Doc<'users'> & {
  avatarUrl?: string;
};

export type UserId = Id<'users'>;

export type StorageId = Id<'_storage'>;

export type TournamentId = Id<'tournaments'>;

export type UpdateUserInput = typeof api.users.updateUser.updateUser._args;

export type FetchTournamentListInput = typeof api.tournaments.fetchTournamentList.fetchTournamentList._args;

export type FetchTournamentList = typeof api.tournaments.fetchTournamentList.fetchTournamentList._returnType;

export type FetchTournamentListItem = FetchTournamentList[number];

export type FetchTournamentResponse = typeof api.tournaments.fetchTournament.fetchTournament._returnType;
