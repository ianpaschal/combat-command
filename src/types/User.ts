import { Timestamp } from './Timestamp';
import { UUID } from './UUID';

export interface User {
  id: UUID; // Primary key

  created_at: Timestamp;
  updated_at: Timestamp;

  // Always visible
  username: string;
  avatar_url: string | null;

  // Extra data
  given_name: string | null;
  family_name: string | null;
  name_visibility: 'public' | 'tournaments' | 'private';
}