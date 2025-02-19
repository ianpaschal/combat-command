import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
// import { CreateGameSystemConfigInput } from '~/services/gameSystemConfigs/useCreateGameSystemConfig';
import { handleError } from '~/services/handleError';
// import { createPlayer } from '~/services/players/createPlayer';
// import { CreatePlayerInput } from '~/services/players/createPlayer';
import { supabase } from '~/supabaseClient';
import { MatchResultRow } from '~/types/db';

/**
 * Input to create a new single match result.
 */
export interface CreateSingleMatchResultInput {
  // player_0: CreatePlayerInput;
  // player_1: CreatePlayerInput;
  // game_system_config: CreateGameSystemConfigInput;
  details: Pick<MatchResultRow, 'details'>;
}

/**
 * Query hook to create a single match result.
 * 
 * This is kept separate from the hook to create a tournament match result because the latter
 * doesn't require the creation of new player and game system config objects.
 */
export const useCreateSingleMatchResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: object): Promise<MatchResultRow> => {

      // Check if player_0_id and player_1_id exist. If not, create the player objects.
      // const player0Row = await createPlayer(data.player_0);

      // Check if game_system_config_id exists. If not, create it.

      const { data: updatedRow, error } = await supabase.from('match_results').insert(data).select().single();
      if (error) {
        throw error;
      }
      return updatedRow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match_results', 'list'] });
      toast.success('Match result saved!');
    },
    onError: handleError,
  });
};
