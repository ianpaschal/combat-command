import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

import { matchResultCommentsTable } from './_model/matchResultComments';
import { matchResultLikesTable } from './_model/matchResultLikes';
import { matchResultsTable } from './_model/matchResults';
import { tournamentCompetitorsTable } from './_model/tournamentCompetitors';
import { tournamentPairingsTable } from './_model/tournamentPairings';
import { tournamentsTable } from './_model/tournaments';
import { tournamentTimersTable } from './_model/tournamentTimers';
import { friendships } from './friendships';
import { photos } from './photos';
import { users } from './users';

export default defineSchema({
  ...authTables,
  friendships,
  matchResultComments: matchResultCommentsTable,
  matchResultLikes: matchResultLikesTable,
  matchResults: matchResultsTable,
  photos,
  tournamentCompetitors: tournamentCompetitorsTable,
  tournamentPairings: tournamentPairingsTable,
  tournaments: tournamentsTable,
  tournamentTimers: tournamentTimersTable,
  users,
});
