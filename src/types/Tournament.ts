import { Timestamp } from './Timestamp';
import { UUID } from './UUID';

export interface Tournament {
  id: UUID;
  created_at: Timestamp;
  modified_at: Timestamp;
  visibility: 'draft' | 'hidden' | 'public';
  registration_open: boolean;
  match_results_open: boolean;
  team_size_limit: number | null;
  active_round_index: number | null;
  round_count: number;
  type: 'team' | 'solo';
  
  // Display info
  title: string;
  description: string;
  start_date: Timestamp;
  end_date: Timestamp;
  location: string;

  game_system_id: UUID; // Foreign key, table: game_systems
  organizer_ids: UUID[]; // Foreign key, table: users
}

export interface TournamentTeam {
  tournament_team_id: UUID;
  created_at: Timestamp;
  modified_at: Timestamp;
  tournament_id: UUID; // foreign key
  name: string;
}

export type TournamentFields = Omit<Tournament, 'tournament_id' | 'created_at' | 'modified_at'>;

