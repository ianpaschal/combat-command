import { Infer, v } from 'convex/values';

export const battlePlans = [
  'attack',
  'maneuver',
  'defend',
] as const;

export const fowV4BattlePlan = v.union(...battlePlans.map(v.literal));

export type FowV4BattlePlan = Infer<typeof fowV4BattlePlan>;

export const battlePlanDisplayNames: Record<FowV4BattlePlan, string> = {
  'attack': 'Attack',
  'maneuver': 'Maneuver',
  'defend': 'Defend',
};

export const fowV4BattlePlanOptions = battlePlans.map((battlePlan) => ({
  value: battlePlan,
  label: battlePlanDisplayNames[battlePlan],
}));
