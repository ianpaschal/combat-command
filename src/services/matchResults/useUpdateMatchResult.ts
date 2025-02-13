import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { CreateGameSystemConfigInput } from '~/services/gameSystemConfigs/useCreateGameSystemConfig';
import { handleError } from '~/services/handleError';
import { CreatePlayerInput } from '~/services/players/useCreatePlayer';
import { supabase } from '~/supabaseClient';
import { MatchResultRow } from '~/types/db';

/**
 * Input to update a match result.
 * Can optionally include entirely new data for players and config which will overwrite old data.
 */
export type UpdateMatchResultInput = Omit<MatchResultRow, 'created_at' | 'updated_at'> & {
  player_0?: CreatePlayerInput;
  player_1?: CreatePlayerInput;
  game_system_config?: CreateGameSystemConfigInput;
};

/**
 * Query hook to update a match result.
 */
export const useUpdateMatchResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateMatchResultInput): Promise<void> => {
      if (data.player_0) {
        const { error: updatePlayer0Error } = await supabase.from('players').update(data.player_0).eq('id', data.player_0_id);
        if (updatePlayer0Error) {
          throw updatePlayer0Error;
        }
      }

      if (data.player_1) {
        const { error: updatePlayer1Error } = await supabase.from('players').update(data.player_1).eq('id', data.player_1_id);
        if (updatePlayer1Error) {
          throw updatePlayer1Error;
        }
      }

      if (data.game_system_config) {
        const { error: updateGameSystemConfigError } = await supabase.from('game_system_configs').update(data.game_system_config).eq('id', data.game_system_config_id);
        if (updateGameSystemConfigError) {
          throw updateGameSystemConfigError;
        }
      }

      const { error } = await supabase.from('match_results').update(data).eq('id', id);
      if (error) {
        throw error;
      }
    },
    onSuccess: (_data, args) => {
      queryClient.invalidateQueries({ queryKey: ['match_results', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['match_results', 'single', args.id] });
      toast.success('Match result updated!');
    },
    onError: handleError,
  });
};