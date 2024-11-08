import { Database } from '~/types/__generated__/database.types';
import { TournamentCompetitorDeep } from '~/types/db';

/**
 * Raw Tournament Pairing row from the database
 */
export type TournamentPairingRow = Database['public']['Tables']['tournament_pairings']['Row'];

/**
 * Tournament Pairing row from the database, with Deep Tournament Competitors joined
 */
export type TournamentPairingDeep = TournamentPairingRow & {
  competitor_0: TournamentCompetitorDeep;
  competitor_1: TournamentCompetitorDeep;
};

/**
 * Input to create a new Tournament Pairing
 */
export type TournamentPairingInput = Omit<TournamentPairingRow, 'id' | 'created_at' | 'updated_at'>;