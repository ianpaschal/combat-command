import { authTables } from '@convex-dev/auth/server';
import { defineSchema } from 'convex/server';

import { fowV4MissionMatrixes } from './fowV4/fowV4MissionMatrixes';
import { fowV4MissionPacks } from './fowV4/fowV4MissionPacks';
import { fowV4Missions } from './fowV4/fowV4Missions';
import { matchResultComments } from './matchResultComments';
import { matchResultLikes } from './matchResultLikes';
import { matchResults } from './matchResults';
import { photos } from './photos';
import {
  friendships,
  tournamentPairings,
  tournaments,
  users,
} from './tables';
import { tournamentCompetitors } from './tournamentCompetitors';

export default defineSchema({
  ...authTables,
  fowV4MissionMatrixes,
  fowV4MissionPacks,
  fowV4Missions,
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
