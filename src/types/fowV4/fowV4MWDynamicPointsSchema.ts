import { z, ZodLiteral } from 'zod';

export const fowV4MWDynamicPointsSchema = z.union([
  z.literal('mw_2023_02_09'),
  z.literal('mw_2023_12_20'),
  z.literal('mw_2024_12_13'),
]);

export type FowV4MWDynamicPoints = z.infer<typeof fowV4MWDynamicPointsSchema>;

export const fowV4MWDynamicPointsLabels: Record<FowV4MWDynamicPoints, string> = {
  mw_2023_02_09: '2023',
  mw_2023_12_20: '2024',
  mw_2024_12_13: '2025',
};

export const fowV4MWDynamicPointsOptions = fowV4MWDynamicPointsSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4MWDynamicPointsLabels[value] }),
);
