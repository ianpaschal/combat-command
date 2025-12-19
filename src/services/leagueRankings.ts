import { api } from '~/api';
import { createPaginatedQueryHook, createQueryHook } from '~/services/utils';

// Special Queries
export const useGetLeagueRankingFullResults = createQueryHook(api.leagueRankings.getLeagueRankingFullResults);
export const useGetLeagueRankingsByLeague = createPaginatedQueryHook(api.leagueRankings.getLeagueRankingsByLeague);
