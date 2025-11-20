import { api } from '~/api';
import { createQueryHook } from '~/services/utils';

export const useGetTournamentResultsByCompetitor = createQueryHook(api.tournamentResults.getTournamentResultsByCompetitor);
export const useGetTournamentResultsByGameSystem = createQueryHook(api.tournamentResults.getTournamentResultsByGameSystem);
export const useGetTournamentResultsByRound = createQueryHook(api.tournamentResults.getTournamentResultsByRound);
