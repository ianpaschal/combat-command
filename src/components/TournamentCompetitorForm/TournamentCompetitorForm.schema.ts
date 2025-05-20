import { DeepPartial } from 'react-hook-form';
import { z } from 'zod';

import { TournamentCompetitor, UserId } from '~/api';

export const createSchema = (
  competitorSize: number,
  existingCompetitors: TournamentCompetitor[] = [],
) => z.object({
  teamName: z.string(),
  players: z.array(
    z.object({
      active: z.boolean(),
      userId: z.string().transform((val) => val as UserId),
    }),
  ),
}).superRefine((data, ctx) => {
  const activeCount = data.players.filter(player => player.active).length;
  if (activeCount < competitorSize) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `At least ${competitorSize} player(s) must be active.`,
      path: ['players'],
    });
  }
  if (existingCompetitors.find((c) => c.teamName === data.teamName.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A team with that name already exists.',
      path: ['teamName'],
    });
  }
});

export type FormData = z.infer<ReturnType<typeof createSchema>>;

export const defaultValues: DeepPartial<FormData> = {
  teamName: '',
  players: [],
};

export const getDefaultValues = (competitorSize = 1): DeepPartial<FormData> => ({
  teamName: '',
  players: Array.from({ length: competitorSize }, () => ({ userId: '', active: true })),
});
