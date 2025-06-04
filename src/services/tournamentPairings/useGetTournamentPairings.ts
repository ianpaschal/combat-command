import { api } from '~/api';
import { createQueryHook } from '~/services/utils';

export const useGetTournamentPairings = createQueryHook(api.tournamentPairings.getTournamentPairings);
