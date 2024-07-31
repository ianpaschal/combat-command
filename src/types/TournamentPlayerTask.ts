import { Timestamp } from './Timestamp';
import { UUID } from './UUID';

export interface TournamentPlayerTask {
  completed_by_player_ids: UUID[]; // Foreign key array
  created_at: Timestamp;
  description?: string;
  due_by: Timestamp;
  modified_at: Timestamp;
  title: string;
  tournament_id: UUID; // Foreign key
  tournament_player_task_id: UUID; // Primary key
}
