import { z } from 'zod';

import {
  TournamentCompetitorId,
  TournamentId,
  UserId,
} from '~/api';

// Helper to convert empty strings and null to undefined
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((val) => (val === '' || val === null ? undefined : val), schema);

export const createSchema = () => z.object({
  tournamentCompetitor: emptyToUndefined(z.object({
    teamName: emptyToUndefined(z.string({
      message: 'Please provide a team name.',
    }).min(2).optional()),
  }).optional()),
  tournamentCompetitorId: emptyToUndefined(z.string({
    message: 'Please select a team.',
  }).transform((val) => val as TournamentCompetitorId).optional()),
  tournamentId: z.string({
    message: 'Please select a tournament.',
  }).transform((val) => val as TournamentId),
  userId: z.string({
    message: 'Please select a user.',
  }).transform((val) => val as UserId),
});

export type SubmitData = z.infer<ReturnType<typeof createSchema>>;

export type FormData = {
  tournamentCompetitor: {
    teamName: string;
  };
  tournamentCompetitorId: TournamentCompetitorId | null;
  tournamentId: TournamentId | null;
  userId: UserId | null;
};

export const defaultValues: FormData = {
  tournamentCompetitor: {
    teamName: '',
  },
  tournamentCompetitorId: null,
  tournamentId: null,
  userId: null,
};
