import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { MatchResultRow } from '~/types/db';

/**
 * Input to create a new single match result.
 */
export interface CreateSingleMatchResultInput {
  player_0: {
    profile_id: string;
    placeholder_name?: string;
  }
  player_1: {
    profile_id: string;
    placeholder_name?: string;
  }
  game_system_config: {
    game_system_id: string;
    data: unknown;
  }
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
    mutationFn: async (data: CreateSingleMatchResultInput): Promise<void> => {

      // Check if player_0_id and player_1_id exist. If not, create the player objects.

      // Check if game_system_config_id exists. If not, create it.

      const { error } = await supabase.from('match_results').insert(data);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match_results', 'list'] });
      toast.success('Match result saved!');
    },
    onError: handleError,
  });
};