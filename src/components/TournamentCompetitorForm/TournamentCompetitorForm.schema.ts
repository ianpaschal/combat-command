import { DeepPartial } from 'react-hook-form';
import { z } from 'zod';

import { TournamentCompetitor, UserId } from '~/api';

export const createSchema = (
  mode: 'create' | 'update',
  otherCompetitors: TournamentCompetitor[] = [],
) => z.object({
  teamName: z.string().min(1, 'Please provide a team name.'),
  captain: z.object({
    userId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),
  }),
}).superRefine((data, ctx) => {
  if (mode === 'create' && !data.captain.userId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a captain.',
      path: ['captain'],
    });
  }
  if (otherCompetitors.find((c) => c.teamName?.toLowerCase() === data.teamName.trim().toLowerCase())) {
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
});
