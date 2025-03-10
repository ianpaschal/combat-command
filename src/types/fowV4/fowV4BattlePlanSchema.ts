import { z, ZodLiteral } from 'zod';

export const fowV4BattlePlanSchema = z.union([
  z.literal('attack'),
  z.literal('maneuver'),
  z.literal('defend'),
], { message: 'Please select a stance.' });

export type FowV4BattlePlan = z.infer<typeof fowV4BattlePlanSchema>;

export const fowV4BattlePlanLabels: Record<FowV4BattlePlan, string> = {
  attack: 'Attack',
  maneuver: 'Maneuver',
  defend: 'Defend',
};

export const fowV4BattlePlanOptions = fowV4BattlePlanSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4BattlePlanLabels[value] }),
);
