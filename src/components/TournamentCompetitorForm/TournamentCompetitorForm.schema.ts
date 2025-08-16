import { DeepPartial } from 'react-hook-form';
import { z } from 'zod';

import { TournamentCompetitor, UserId } from '~/api';

export const createSchema = (
  otherCompetitors: TournamentCompetitor[] = [],
) => z.object({
  teamName: z.string(),
  addedPlayers: z.array(z.object({
    userId: z.string().transform((val) => val.length ? val as UserId : undefined),
  })),
}).superRefine((data, ctx) => {
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
  addedPlayers: [],
};

export const getDefaultValues = (userId?: UserId, existingCompetitor?: TournamentCompetitor): DeepPartial<FormData> => {
  if (existingCompetitor) {
    return {
      teamName: existingCompetitor.teamName,
    };
  } else {
    return {
      teamName: '',
      addedPlayers: [{ userId }],
    };
  }
};
