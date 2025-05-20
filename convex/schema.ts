import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

import { tournamentCompetitors } from './_model/tournamentCompetitors';
import { tournamentPairings } from './_model/tournamentPairings';
import { tournaments } from './_model/tournaments';
import { tournamentTimers } from './_model/tournamentTimers';
import { friendships } from './friendships';
import { matchResultComments } from './matchResultComments';
import { matchResultLikes } from './matchResultLikes';
import { matchResults } from './matchResults';
import { photos } from './photos';
import { users } from './users';

export default defineSchema({
  ...authTables,
  friendships,
  matchResultComments,
  matchResultLikes,
  matchResults,
  photos,
  tournamentCompetitors,
  tournamentPairings,
  tournaments,
  tournamentTimers,
  users,
});
