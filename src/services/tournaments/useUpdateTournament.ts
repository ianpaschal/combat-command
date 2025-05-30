import { api } from '~/api';
import { createMutationHook } from '~/services/utils';

export const useUpdateTournament = createMutationHook(api.tournaments.updateTournament);
