import { z, ZodLiteral } from 'zod';

export const fowV4stanceSchema = z.union([
  z.literal('attack'),
  z.literal('maneuver'),
  z.literal('defend'),
], { message: 'Please select a stance' });

export type FowV4Stance = z.infer<typeof fowV4stanceSchema>;

export const fowV4StanceLabels: Record<FowV4Stance, string> = {
  attack: 'Attack',
  maneuver: 'Maneuver',
  defend: 'Defend',
};

export const fowV4StanceOptions = fowV4stanceSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4StanceLabels[value] }),
);