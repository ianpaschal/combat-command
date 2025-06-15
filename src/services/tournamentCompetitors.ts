import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetTournamentCompetitor = createQueryHook(api.tournamentCompetitors.getTournamentCompetitor);
export const useGetTournamentCompetitors = createQueryHook(api.tournamentCompetitors.getTournamentCompetitors);

// Special Queries
export const useGetTournamentCompetitorsByTournament = createQueryHook(api.tournamentCompetitors.getTournamentCompetitorsByTournament);

// Basic (C_UD) Mutations
export const useCreateTournamentCompetitor = createMutationHook(api.tournamentCompetitors.createTournamentCompetitor);
export const useUpdateTournamentCompetitor = createMutationHook(api.tournamentCompetitors.updateTournamentCompetitor);

// Special Mutations
export const useAddTournamentCompetitorPlayer = createMutationHook(api.tournamentCompetitors.addTournamentCompetitorPlayer);
export const useRemoveTournamentCompetitorPlayer = createMutationHook(api.tournamentCompetitors.removeTournamentCompetitorPlayer);
export const useToggleTournamentCompetitorActive = createMutationHook(api.tournamentCompetitors.toggleTournamentCompetitorActive);
