import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

import { listsTable } from './_model/lists';
import { matchResultCommentsTable } from './_model/matchResultComments';
import { matchResultLikesTable } from './_model/matchResultLikes';
import { matchResultsTable } from './_model/matchResults';
import { tournamentCompetitorsTable } from './_model/tournamentCompetitors';
import { tournamentPairingsTable } from './_model/tournamentPairings';
import { tournamentsTable } from './_model/tournaments';
import { tournamentTimersTable } from './_model/tournamentTimers';
import { userPreferencesTable } from './_model/userPreferences';
import { usersTable } from './_model/users';
import { friendships } from './friendships';
import { photosTable } from './photos';

export default defineSchema({
  ...authTables,
  friendships,
  lists: listsTable,
  matchResultComments: matchResultCommentsTable,
  matchResultLikes: matchResultLikesTable,
  matchResults: matchResultsTable,
  userPreferences: userPreferencesTable,
  photos: photosTable,
  tournamentCompetitors: tournamentCompetitorsTable,
  tournamentPairings: tournamentPairingsTable,
  tournaments: tournamentsTable,
  tournamentTimers: tournamentTimersTable,
  users: usersTable,
});
