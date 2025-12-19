import { api } from '~/api';
import { createQueryHook } from '~/services/utils';

// Basic Queries
export const useGetLeague = createQueryHook(api.leagues.getLeague);
export const useGetLeagues = createQueryHook(api.leagues.getLeagues);
