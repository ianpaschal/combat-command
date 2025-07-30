import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetTournament = createQueryHook(api.tournaments.getTournament);
export const useGetTournaments = createQueryHook(api.tournaments.getTournaments);

// Special Queries
export const useGetAvailableTournamentActions = createQueryHook(api.tournaments.getAvailableTournamentActions);
export const useGetTournamentOpenRound = createQueryHook(api.tournaments.getTournamentOpenRound);
export type TournamentOpenRound = typeof api.tournaments.getTournamentOpenRound._returnType; // TODO: Move to back-end
export const useGetTournamentRankings = createQueryHook(api.tournaments.getTournamentRankings);
export const useGetTournamentsByStatus = createQueryHook(api.tournaments.getTournamentsByStatus);
export const useGetTournamentsByUser = createQueryHook(api.tournaments.getTournamentsByUser);

// Basic (C_UD) Mutations
export const useCreateTournament = createMutationHook(api.tournaments.createTournament);
export const useUpdateTournament = createMutationHook(api.tournaments.updateTournament);
export const useDeleteTournament = createMutationHook(api.tournaments.deleteTournament);

// Special Mutations
export const useEndTournament = createMutationHook(api.tournaments.endTournament);
export const useEndTournamentRound = createMutationHook(api.tournaments.endTournamentRound);
export const usePublishTournament = createMutationHook(api.tournaments.publishTournament);
export const useStartTournament = createMutationHook(api.tournaments.startTournament);
export const useStartTournamentRound = createMutationHook(api.tournaments.startTournamentRound);
