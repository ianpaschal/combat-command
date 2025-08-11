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

export const fowV4Factions: string[] = [
  'flames_of_war_v4::faction::germany',
  'flames_of_war_v4::faction::soviet_union',
  'flames_of_war_v4::faction::united_states',
  'flames_of_war_v4::faction::great_britain',
  'flames_of_war_v4::faction::australia',
  'flames_of_war_v4::faction::italy',
  'flames_of_war_v4::faction::finland',
  'flames_of_war_v4::faction::hungary',
  'flames_of_war_v4::faction::romania',
  'flames_of_war_v4::faction::japan',
  'flames_of_war_v4::faction::france',
] as const;

export const fowV4FactionId = v.union(...fowV4Factions.map((id) => v.literal(id)));

export type FowV4FactionId = Infer<typeof fowV4FactionId>;

export const fowV4MatchResultDetails = v.object({
  attacker: v.union(v.literal(0), v.literal(1)),
  firstTurn: v.union(v.literal(0), v.literal(1)),
  mission,
  outcomeType,
  player0FactionId: v.optional(fowV4FactionId),
  player0Faction: v.optional(faction),
  player0BattlePlan: battlePlan,
  player0UnitsLost: v.number(),
  player1FactionId: v.optional(fowV4FactionId),
  player1Faction: v.optional(faction),
  player1BattlePlan: battlePlan,
  player1UnitsLost: v.number(),
  turnsPlayed: v.number(),
  winner: v.union(v.literal(0), v.literal(1), v.literal(-1)),
});

export type FowV4MatchResultDetails = Infer<typeof fowV4MatchResultDetails>;
