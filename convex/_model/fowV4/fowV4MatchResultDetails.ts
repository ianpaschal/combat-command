import {
  BattlePlan,
  Faction,
  MatchOutcomeType,
  MissionName,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { Infer, v } from 'convex/values';

import { fowV4FactionId } from '../../static/fowV4/factions';
import { fowV4MissionId } from '../../static/fowV4/missionPacks';
import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';

const battlePlan = getStaticEnumConvexValidator(BattlePlan);
const faction = getStaticEnumConvexValidator(Faction);
const mission = getStaticEnumConvexValidator(MissionName);
const outcomeType = getStaticEnumConvexValidator(MatchOutcomeType);

export const fowV4MatchResultDetails = v.object({
  attacker: v.union(v.literal(0), v.literal(1)),
  firstTurn: v.union(v.literal(0), v.literal(1)),
  missionId: v.optional(fowV4MissionId), // TODO: REMOVE AFTER MIGRATION
  mission: v.optional(mission),
  outcomeType: outcomeType,
  player0FactionId: v.optional(fowV4FactionId), // TODO: REMOVE AFTER MIGRATION
  player0Faction: v.optional(faction),
  player0BattlePlan: battlePlan,
  player0UnitsLost: v.number(),
  player1FactionId: v.optional(fowV4FactionId), // TODO: REMOVE AFTER MIGRATION
  player1Faction: v.optional(faction),
  player1BattlePlan: battlePlan,
  player1UnitsLost: v.number(),
  turnsPlayed: v.number(),
  winner: v.union(v.literal(0), v.literal(1), v.literal(-1)),
});

export type FowV4MatchResultDetails = Infer<typeof fowV4MatchResultDetails>;
