import { api } from '~/api';
import { createMutationHook } from '~/services/utils';

export const useCreateTournament = createMutationHook(api.tournaments.createTournament);
