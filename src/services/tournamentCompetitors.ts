import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetTournamentCompetitor = createQueryHook(api.tournamentCompetitors.getTournamentCompetitor);
export const useGetTournamentCompetitorsByTournamentId = createQueryHook(api.tournamentCompetitors.getTournamentCompetitorListByTournamentId);

// Basic (C_UD) Mutations
export const useCreateTournamentCompetitor = createMutationHook(api.tournamentCompetitors.createTournamentCompetitor);
export const useUpdateTournamentCompetitor = createMutationHook(api.tournamentCompetitors.updateTournamentCompetitor);

// Special Mutations
export const useAddPlayerToTournamentCompetitor = createMutationHook(api.tournamentCompetitors.addPlayerToTournamentCompetitor);
export const useRemovePlayerFromTournamentCompetitor = createMutationHook(api.tournamentCompetitors.removePlayerFromTournamentCompetitor);
export const useToggleTournamentCompetitorActive = createMutationHook(api.tournamentCompetitors.toggleTournamentCompetitorActive);
