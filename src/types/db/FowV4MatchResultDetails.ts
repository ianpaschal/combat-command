import { FowV4BattlePlan } from '~/types/fowV4/fowV4BattlePlanSchema';

export type PlayerIndex = 0 | 1;

export interface FowV4MatchResultDetails {
  player_0_stance: FowV4BattlePlan;
  player_0_units_lost: number;
  player_1_stance: FowV4BattlePlan;
  player_1_units_lost: number;
  winner: PlayerIndex | null;
  attacker: PlayerIndex;
  first_turn: PlayerIndex;
  mission_id: string;
  turns_played: number;
}
