import { api } from '~/api';
import { createMutationHook, createQueryHook } from '~/services/utils';

export const useGetTournamentTimer = createQueryHook(api.tournamentTimers.getTournamentTimer);
export const useStartTournamentTimer = createMutationHook(api.tournamentTimers.startTournamentTimer);
export const usePauseTournamentTimer = createMutationHook(api.tournamentTimers.pauseTournamentTimer);
export const useResetTournamentTimer = createMutationHook(api.tournamentTimers.resetTournamentTimer);
