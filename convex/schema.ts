import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

import friendships from './_model/friendships/table'; 
import lists from './_model/lists/table';
import matchResultComments from './_model/matchResultComments/table';
import matchResultLikes from './_model/matchResultLikes/table';
import matchResults from './_model/matchResults/table';
import photos from './_model/photos/table'; 
import tournamentCompetitors from './_model/tournamentCompetitors/table';
import tournamentOrganizers from './_model/tournamentOrganizers/table';
import tournamentPairings from './_model/tournamentPairings/table';
import tournamentRegistrations from './_model/tournamentRegistrations/table';
import tournamentResults from './_model/tournamentResults/table';
import tournaments from './_model/tournaments/table';
import tournamentTimers from './_model/tournamentTimers/table';
import userPreferences from './_model/userPreferences/table';
import users from './_model/users/table';

export default defineSchema({
  ...authTables,
  friendships,
  lists,
  matchResultComments,
  matchResultLikes,
  matchResults,
  photos,
  tournamentCompetitors,
  tournamentOrganizers,
  tournamentPairings,
  tournamentRegistrations,
  tournamentResults,
  tournaments,
  tournamentTimers,
  userPreferences,
  users,
});
