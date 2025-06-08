import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

import { tournamentCompetitors } from './_model/tournamentCompetitors';
import { tournamentPairingsTable } from './_model/tournamentPairings';
import { tournamentsTable } from './_model/tournaments';
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
  tournamentCompetitors,
  tournamentPairings: tournamentPairingsTable,
  tournaments: tournamentsTable,
  users,
  photos,
});
