import { z, ZodLiteral } from 'zod';

export const fowV4EraSchema = z.union([
  z.literal('ew'),
  z.literal('mw'),
  z.literal('lw'),
  z.literal('lwl'),
  z.literal('pacific'),
]);

export type FowV4Era = z.infer<typeof fowV4EraSchema>;

export const fowV4EraLabels: Record<FowV4Era, string> = {
  ew: 'Early War',
  mw: 'Mid-War',
  lw: 'Late War',
  lwl: 'Late War Leviathans',
  pacific: 'Pacific',
};

export const fowV4EraOptions = fowV4EraSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4EraLabels[value] }),
);