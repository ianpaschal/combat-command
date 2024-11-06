import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '~/supabaseClient';
import { TournamentRow } from '~/types/db';

export type UpdateTournamentInput = Partial<TournamentRow> & { id: string };

export const updateTournament = async ({ id, ...data }: UpdateTournamentInput): Promise<void> => {
  console.log('updatedata', data);
  const { error } = await supabase
    .from('tournaments')
    .update(data)
    .eq('id', id);
  if (error) {
    throw error;
  }
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournament,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments_list'] });
      queryClient.invalidateQueries({ queryKey: ['tournament_full', variables.id] });
    },
    onError: (error) => {
      toast.error('Error updating tournament', {
        description: error.message,
        icon: <CircleAlert />,
      });
    },
  });
};