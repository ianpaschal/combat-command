import {
  BattlePlan,
  Faction,
  MatchOutcomeType,
  MissionName,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { Infer, v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';

const battlePlan = getStaticEnumConvexValidator(BattlePlan);
const faction = getStaticEnumConvexValidator(Faction);
const mission = getStaticEnumConvexValidator(MissionName);
const outcomeType = getStaticEnumConvexValidator(MatchOutcomeType);

export const fowV4MatchResultDetails = v.object({
  attacker: v.union(v.literal(0), v.literal(1)),
  firstTurn: v.union(v.literal(0), v.literal(1)),
  mission,
  outcomeType,
  player0Faction: v.optional(faction),
  player0BattlePlan: battlePlan,
  player0UnitsLost: v.number(),
  player1Faction: v.optional(faction),
  player1BattlePlan: battlePlan,
  player1UnitsLost: v.number(),
  turnsPlayed: v.number(),
  winner: v.union(v.literal(0), v.literal(1), v.literal(-1)),
  scoreOverride: v.optional(v.object({
    player0Score: v.number(),
    player1Score: v.number(),
  })),
});

export type FowV4MatchResultDetails = Infer<typeof fowV4MatchResultDetails>;
