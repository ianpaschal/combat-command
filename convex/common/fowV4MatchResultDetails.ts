import { Infer, v } from 'convex/values';

import { fowV4BattlePlan } from './fowV4BattlePlan';

export const fowV4MatchResultDetails = v.object({
  player0BattlePlan: fowV4BattlePlan,
  player0UnitsLost: v.number(),
  player1BattlePlan: fowV4BattlePlan,
  player1UnitsLost: v.number(),
  winner: v.union(v.literal(0), v.literal(1), v.null()),
  attacker: v.union(v.literal(0), v.literal(1)),
  first_turn: v.union(v.literal(0), v.literal(1)),
  mission_id: v.string(),
  turns_played: v.number(),
});

export type FowV4MatchResultDetails = Infer<typeof fowV4MatchResultDetails>;
