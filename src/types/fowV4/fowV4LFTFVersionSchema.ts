import { z, ZodLiteral } from 'zod';

export const fowV4LFTFVersionSchema = z.union([
  z.literal('lftf_2018_12'),
  z.literal('lftf_2019_10'),
  z.literal('lftf_2020_10'),
  // Presumably 1 or 2 missing...
  z.literal('lftf_2023_03'),
  z.literal('lftf_2024_03'),
]);

export type FowV4MWDynamicPoints = z.infer<typeof fowV4LFTFVersionSchema>;

export const fowV4LFTFVersionLabels: Record<FowV4MWDynamicPoints, string> = {
  lftf_2018_12: 'December 2018',
  lftf_2019_10: 'October 2019',
  lftf_2020_10: 'October 2020',
  lftf_2023_03: 'March 2023',
  lftf_2024_03: 'March 2024 (Latest)',
};

export const fowV4LFTFVersionOptions = fowV4LFTFVersionSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4LFTFVersionLabels[value] }),
);
