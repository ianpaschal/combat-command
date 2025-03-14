import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

import { friendships } from './friendships';
import { matchResultComments } from './matchResultComments';
import { matchResultLikes } from './matchResultLikes';
import { matchResults } from './matchResults';
import { photos } from './photos';
import { tournamentCompetitors } from './tournamentCompetitors';
import { tournamentPairings } from './tournamentPairings';
import { tournaments } from './tournaments';
import { users } from './users';

export default defineSchema({
  ...authTables,
  friendships,
  matchResultComments,
  matchResultLikes,
  matchResults,
  tournamentCompetitors,
  tournamentPairings,
  tournaments,
  users,
  photos,
});
