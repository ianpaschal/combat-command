import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetTournament = createQueryHook(api.tournaments.getTournament);
export const useGetTournaments = createQueryHook(api.tournaments.getTournaments);

// Special Queries
export const useGetTournamentOpenRound = createQueryHook(api.tournaments.getTournamentOpenRound);
export type TournamentOpenRound = typeof api.tournaments.getTournamentOpenRound._returnType; // TODO: Move to back-end
export const useGetTournamentRankings = createQueryHook(api.tournaments.getTournamentRankings);

// Basic (C_UD) Mutations
export const useCreateTournament = createMutationHook(api.tournaments.createTournament);
export const useUpdateTournament = createMutationHook(api.tournaments.updateTournament);
export const useDeleteTournament = createMutationHook(api.tournaments.deleteTournament);

// Special Mutations
export const useCloseTournamentRound = createMutationHook(api.tournaments.closeTournamentRound);
export const useEndTournament = createMutationHook(api.tournaments.endTournament);
export const useOpenTournamentRound = createMutationHook(api.tournaments.openTournamentRound);
export const usePublishTournament = createMutationHook(api.tournaments.publishTournament);
export const useStartTournament = createMutationHook(api.tournaments.startTournament);
