import { Record } from './DbRecord';
import { UUID } from './UUID';

export interface List<T> extends Record {
  game_system_id: UUID;
  points_version: string; // e.g. fow_mw_dynamic_2024
  locked: boolean;
  data: T;
}