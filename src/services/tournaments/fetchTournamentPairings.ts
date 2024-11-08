import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import {
  PlayerRow,
  TournamentCompetitorRow,
  UserProfileSecureRow,
} from '~/types/db';
import { TournamentPairingRow } from '~/types/db/TournamentPairings';

export interface TournamentPairingsResponse extends TournamentPairingRow {
  competitor_0: TournamentCompetitorRow & {
    players: (PlayerRow & {
      profile: UserProfileSecureRow;
    })[];
  };
  competitor_1: TournamentCompetitorRow & {
    players: (PlayerRow & {
      profile: UserProfileSecureRow;
    })[];
  };
}

export const fetchTournamentParings = async (): Promise<TournamentPairingsResponse[]> => {
  const { data, error } = await supabase
    .from('tournament_pairings')
    .select(`
      *,
      competitor_0: tournament_competitors!competitor_0_id (
        *,
        players (
          *,
          profile: user_profiles!user_id (*)
        )
      ),
      competitor_1: tournament_competitors!competitor_1_id (
        *,
        players (
          *,
          profile: user_profiles!user_id (*)
        )
      )
    `);
  if (error) {
    throw error;
  }
  return data;
};

export const useFetchTournamentParings = () => useQuery({
  queryKey: ['tournament_pairings'],
  queryFn: fetchTournamentParings,
});