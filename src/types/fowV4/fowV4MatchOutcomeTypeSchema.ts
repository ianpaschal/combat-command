import { z, ZodLiteral } from 'zod';

export const fowV4MatchOutcomeTypeSchema = z.union([
  z.literal('objective_taken'),
  z.literal('objective_defended'),
  z.literal('time_out'),
  z.literal('force_broken'),
]);

export type FowV4MatchOutcomeType = z.infer<typeof fowV4MatchOutcomeTypeSchema>;

export const fowV4MatchOutcomeTypeLabels: Record<FowV4MatchOutcomeType, string> = {
  objective_taken: 'Objective Taken',
  objective_defended: 'Objective Defended',
  time_out: 'Time Out / Draw',
  force_broken: 'Force Broken',
};

export const fowV4EraOptions = fowV4MatchOutcomeTypeSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4MatchOutcomeTypeLabels[value] }),
);