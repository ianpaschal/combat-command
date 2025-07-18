import { DeepPartial } from 'react-hook-form';
import { z } from 'zod';

import { TournamentCompetitor, UserId } from '~/api';

export const createSchema = (
  competitorSize: number,
  status: 'active' | 'published' | 'draft' | 'archived',
  otherCompetitors: TournamentCompetitor[] = [],
) => z.object({
  teamName: z.string(),
  players: z.array(
    z.object({
      active: z.boolean(),
      userId: z.string().transform((val) => val as UserId),
    }),
  ),
}).superRefine((data, ctx) => {
  const activeCount = data.players.filter((player) => player.active).length;
  if (activeCount < competitorSize && status === 'active') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `At least ${competitorSize} players must be active.`,
      path: ['players'],
    });
  }
  if (activeCount > competitorSize) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Only ${competitorSize} players may be active.`,
      path: ['players'],
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

export type FormData = z.infer<ReturnType<typeof createSchema>>;

export const defaultValues: DeepPartial<FormData> = {
  teamName: '',
  players: [],
};

export const getDefaultValues = (competitorSize: number, existingCompetitor?: TournamentCompetitor): DeepPartial<FormData> => ({
  teamName: existingCompetitor?.teamName ?? '',
  players: Array.from({ length: competitorSize }).map((_, i) => ({
    active: existingCompetitor?.players[i]?.active ?? true,
    userId: existingCompetitor?.players[i]?.user._id ?? '',
  })),
});
