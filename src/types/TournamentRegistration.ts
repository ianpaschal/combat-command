import { Timestamp } from './Timestamp';
import { UUID } from './UUID';

export interface TournamentRegistration {
  tournament_registration_id: string; // Primary key
  created_at: Timestamp;
  modified_at: Timestamp;
  tournament_id: UUID; // Foreign key
  user_id: UUID | null; // Foreign key
  shadow_user_id: UUID | null;
  list_id: UUID; // Foreign key
  team_index?: number;
}
