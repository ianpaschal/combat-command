import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

// Special Queries
export const useGetTournamentRegistrationsByCompetitor = createQueryHook(api.tournamentRegistrations.getTournamentRegistrationsByCompetitor);
export const useGetTournamentRegistrationsByTournament = createQueryHook(api.tournamentRegistrations.getTournamentRegistrationsByTournament);
export const useGetTournamentRegistrationsByUser = createQueryHook(api.tournamentRegistrations.getTournamentRegistrationsByUser);

// Basic (C__D) Mutations
export const useCreateTournamentRegistration = createMutationHook(api.tournamentRegistrations.createTournamentRegistration);
export const useDeleteTournamentRegistration = createMutationHook(api.tournamentRegistrations.deleteTournamentRegistration);

// Special Mutations
export const useToggleTournamentRegistrationActive = createMutationHook(api.tournamentRegistrations.toggleTournamentRegistrationActive);
