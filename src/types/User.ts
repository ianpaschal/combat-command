import { Timestamp } from './Timestamp';
import { UUID } from './UUID';

export interface User {
  id: UUID; // Primary key

  created_at: Timestamp;
  updated_at: Timestamp;

  // Always visible
  user_name: string;
  avatar_url: string | null;

  // Extra data
  given_name: string | null;
  given_name_visibility: 'public' | 'tournaments' | 'private';
  family_name: string | null;
  family_name_visibility: 'public' | 'tournaments' | 'private';
}