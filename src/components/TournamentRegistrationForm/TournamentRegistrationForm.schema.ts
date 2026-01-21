import { z } from 'zod';

import {
  Tournament,
  TournamentCompetitorId,
  TournamentId,
  User,
  UserId,
} from '~/api';

// Helper to convert empty strings and null to undefined
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((val) => (val === '' || val === null ? undefined : val), schema);

export const createSchema = (tournament: Tournament, currentUser: User | null) => z.object({
  tournamentCompetitor: emptyToUndefined(z.object({
    teamName: emptyToUndefined(z.string({
      message: 'Please provide a team name.',
    }).min(2, 'Must be at least 2 characters.').optional()), // FIXME: THIS IS NOT WORKING B/C country library interprets 2 and 3 char strings as country codes
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
  nameVisibilityConsent: z.boolean().optional(),
}).superRefine((values, ctx) => {
  if (tournament.useTeams && !values.tournamentCompetitorId && !values.tournamentCompetitor?.teamName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Select a team or enter a new team name.',
      path: ['tournamentCompetitorId'],
    });
  }
  if (tournament.requireRealNames && !values.nameVisibilityConsent && currentUser?._id === values.userId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'This tournament requires real names.',
      path: ['nameVisibilityConsent'],
    });
  }
});

export type SubmitData = z.infer<ReturnType<typeof createSchema>>;

export type FormData = {
  tournamentCompetitor: {
    teamName: string;
  };
  tournamentCompetitorId: TournamentCompetitorId | null;
  tournamentId: TournamentId | null;
  userId: UserId | null;
  nameVisibilityConsent: boolean;
};

export const defaultValues: FormData = {
  tournamentCompetitor: {
    teamName: '',
  },
  tournamentCompetitorId: null,
  tournamentId: null,
  userId: null,
  nameVisibilityConsent: false,
};
