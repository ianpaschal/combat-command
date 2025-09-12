import { DeepPartial } from 'react-hook-form';
import { z } from 'zod';

import { TournamentCompetitor, UserId } from '~/api';
import { scoreAdjustmentSchema } from '~/components/TournamentCompetitorForm/components/ScoreAdjustmentFormItem/ScoreAdjustmentFormItem.schema';

export const createSchema = (
  mode: 'create' | 'update',
  useTeams: boolean,
  otherCompetitors: TournamentCompetitor[] = [],
) => z.object({
  teamName: z.string(),
  captain: z.object({
    userId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),
  }),
  scoreAdjustments: z.array(scoreAdjustmentSchema),
}).superRefine((data, ctx) => {
  if (useTeams && !data.teamName.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please provide a team name.',
      path: ['teamName'],
    });
  }
  if (mode === 'create' && !data.captain.userId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a captain.',
      path: ['captain'],
    });
  }
  if (useTeams && otherCompetitors.find((c) => c.teamName?.toLowerCase() === data.teamName.trim().toLowerCase())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A team with that name already exists.',
      path: ['teamName'],
    });
  }
});

export type TournamentCompetitorSubmitData = z.infer<ReturnType<typeof createSchema>>;

export type TournamentCompetitorFormData = Partial<TournamentCompetitorSubmitData>;

export const getDefaultValues = (userId?: UserId): DeepPartial<TournamentCompetitorSubmitData> => ({
  teamName: '',
  captain: {
    userId,
  },
  scoreAdjustments: [],
});
