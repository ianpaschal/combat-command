import { z, ZodLiteral } from 'zod';

// Presumably 1 or 2 missing...
export const fowV4MissionPackVersionSchema = z.union([
  z.literal('mission_pack_2021_03'),
  z.literal('mission_pack_2022_06'),
  z.literal('mission_pack_2023_04'),
]);

export type FowV4MWDynamicPoints = z.infer<typeof fowV4MissionPackVersionSchema>;

export const fowV4MissionPackVersionLabels: Record<FowV4MWDynamicPoints, string> = {
  mission_pack_2021_03: 'March 2021',
  mission_pack_2022_06: 'June 2022',
  mission_pack_2023_04: 'April 2023 (Latest)',
};

export const fowV4MissionPackVersionOptions = fowV4MissionPackVersionSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4MissionPackVersionLabels[value] }),
);
