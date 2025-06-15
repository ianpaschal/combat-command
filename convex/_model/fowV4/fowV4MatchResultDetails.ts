import { Infer, v } from 'convex/values';

import { fowV4MatchOutcomeType } from '../../_model/fowV4/fowV4MatchOutcomeType';
import { fowV4FactionId } from '../../static/fowV4/factions';
import { fowV4BattlePlan } from '../../static/fowV4/fowV4BattlePlan';
import { fowV4MissionId } from '../../static/fowV4/missionPacks';

export const fowV4MatchResultDetails = v.object({
  attacker: v.union(v.literal(0), v.literal(1)),
  firstTurn: v.union(v.literal(0), v.literal(1)),
  missionId: fowV4MissionId,
  outcomeType: fowV4MatchOutcomeType,
  player0FactionId: v.optional(fowV4FactionId),
  player0BattlePlan: fowV4BattlePlan,
  player0UnitsLost: v.number(),
  player1FactionId: v.optional(fowV4FactionId),
  player1BattlePlan: fowV4BattlePlan,
  player1UnitsLost: v.number(),
  turnsPlayed: v.number(),
  winner: v.union(v.literal(0), v.literal(1), v.literal(-1)),
});

export type FowV4MatchResultDetails = Infer<typeof fowV4MatchResultDetails>;
