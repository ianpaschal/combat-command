import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { TournamentTimerRow } from '~/types/db';

export type GetTournamentTimerInput = {
  tournamentId: string;
  roundIndex: number;
};

export const getTournamentTimer = async (input: GetTournamentTimerInput): Promise<TournamentTimerRow> => {
  let query;
  if (typeof input === 'string') {
    console.log('searching for a timer by id', input);
    query = supabase
      .from('tournament_timers')
      .select('*')
      .eq('id', input)
      .single();
  } else {
    const { tournamentId, roundIndex } = input;
    console.log('searching for a timer by tourney id and round', tournamentId, roundIndex);
    query = supabase
      .from('tournament_timers')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('round_index', roundIndex)
      .single();
  }
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data;
};

export const useGetTournamentTimer = (input?: GetTournamentTimerInput) => useQuery({
  queryKey: ['tournament_timer', input],
  queryFn: input ? () => getTournamentTimer(input) : undefined,
  enabled: !!input,
});