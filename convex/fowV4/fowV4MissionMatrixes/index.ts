import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { fowV4BattlePlan } from '../../common/fowV4/fowV4BattlePlan';

const missionMatrixEntryFields = {
  battlePlans: v.array(fowV4BattlePlan),
  missions: v.array(v.union(v.id('fowV4Missions'), v.array(v.id('fowV4Missions')))), 
};

const fields = {
  missionPackId: v.id('fowV4MissionPacks'),
  displayName: v.string(),
  entries: v.array(v.object(missionMatrixEntryFields)),
};

const table = defineTable(fields).index(
  'by_mission_pack_id', ['missionPackId'],
);

export {
  table as fowV4MissionMatrixes,
  fields as fowV4MissionMatrixFields,
};
