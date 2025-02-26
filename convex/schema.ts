import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

import {
  friendships,
  matchResults,
  tournaments,
  users,
} from './tables';
import { tournamentCompetitors } from './tournamentCompetitors';

export default defineSchema({
  ...authTables,
  friendships,
  matchResults,
  tournamentCompetitors,
  tournaments,
  users,
});
