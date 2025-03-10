import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { fowV4MatchOutcomeType } from '../../common/fowV4/fowV4MatchOutcomeType';

const fields = {
  missionPackId: v.id('fowV4MissionPacks'),
  displayName: v.string(),
  attacker: v.union(v.literal('roll'), v.literal('battle_plan')),
  firstTurn: v.union(v.literal('attacker'), v.literal('defender'), v.literal('roll')),
  objectives: v.object({
    attacker: v.boolean(),
    defender: v.boolean(),
  }),
  outcomeTypes: v.array(fowV4MatchOutcomeType),
};

const table = defineTable(fields).index(
  'by_mission_pack_id', ['missionPackId'],
);

export {
  fields as fowV4MissionFields,
  table as fowV4Missions,
};
