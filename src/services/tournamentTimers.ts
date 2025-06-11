import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

export const useGetTournamentTimer = createQueryHook(api.tournamentTimers.getTournamentTimer);
export const useGetTournamentTimerByTournament = createQueryHook(api.tournamentTimers.getTournamentTimerByTournament);
export const useSetTournamentTimerPhase = createMutationHook(api.tournamentTimers.setTournamentTimerPhase);
export const useToggleTournamentTimer = createMutationHook(api.tournamentTimers.toggleTournamentTimer);
