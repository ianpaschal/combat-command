import { Infer, v } from 'convex/values';

import { fowV4BattlePlan } from './fowV4BattlePlan';
import { fowV4MatchOutcomeType } from './fowV4MatchOutcomeType';

export const fowV4MatchResultDetails = v.object({
  attacker: v.union(v.literal(0), v.literal(1)),
  firstTurn: v.union(v.literal(0), v.literal(1)),
  missionId: v.id('fowV4Missions'),
  outcomeType: fowV4MatchOutcomeType,
  player0BattlePlan: fowV4BattlePlan,
  player0UnitsLost: v.number(),
  player1BattlePlan: fowV4BattlePlan,
  player1UnitsLost: v.number(),
  turnsPlayed: v.number(),
  winner: v.union(v.literal(0), v.literal(1), v.literal(-1)),
});

export type FowV4MatchResultDetails = Infer<typeof fowV4MatchResultDetails>;
