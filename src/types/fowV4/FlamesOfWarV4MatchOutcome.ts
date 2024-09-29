export interface FlamesOfWarV4MatchOutcome {
  mission_id?: string;
  outcome_type: 'objective_taken' | 'objective_defended' | 'time_out' | 'force_broken';
  player_0_results: FlamesOfWarV4PlayerResult;
  player_1_results: FlamesOfWarV4PlayerResult;
  winner: 0 | 1 | null;
  attacker: 0 | 1;
}

export interface FlamesOfWarV4PlayerResult {
  score: number;
  stance?: 'attack' | 'maneuver' | 'defend';
  turns_played?: number;
  units_lost?: number;
}