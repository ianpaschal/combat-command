import { FowV4Stance } from '~/types/fowV4/fowV4StanceSchema';

export type PlayerIndex = 0 | 1;

export interface FowV4MatchResultDetails {
  player_0_stance: FowV4Stance;
  player_0_units_lost: number;
  player_1_stance: FowV4Stance;
  player_1_units_lost: number;
  winner: PlayerIndex | null;
  attacker: PlayerIndex;
  first_turn: PlayerIndex;
  mission_id: string;
  turns_played: number;
}