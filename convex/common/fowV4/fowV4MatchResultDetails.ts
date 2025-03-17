import { Infer, v } from 'convex/values';

import { fowV4FactionId } from '../../static/fowV4/factions';
import { fowV4MissionId } from '../../static/fowV4/missionPacks';
import { fowV4BattlePlan } from './fowV4BattlePlan';
import { fowV4MatchOutcomeType } from './fowV4MatchOutcomeType';

export const fowV4MatchResultDetails = v.object({
  attacker: v.union(v.literal(0), v.literal(1)),
  firstTurn: v.union(v.literal(0), v.literal(1)),
  missionId: v.union(fowV4MissionId, v.string()), // FIXME: Revert to fowV4MissionId
  outcomeType: fowV4MatchOutcomeType,
  player0FactionId: v.optional(v.union(fowV4FactionId, v.string())), // FIXME: Revert to fowV4FactionId
  player0BattlePlan: fowV4BattlePlan,
  player0UnitsLost: v.number(),
  player1FactionId: v.optional(v.union(fowV4FactionId, v.string())), // FIXME: Revert to fowV4FactionId
  player1BattlePlan: fowV4BattlePlan,
  player1UnitsLost: v.number(),
  turnsPlayed: v.number(),
  winner: v.union(v.literal(0), v.literal(1), v.literal(-1)),
});

export type FowV4MatchResultDetails = Infer<typeof fowV4MatchResultDetails>;
