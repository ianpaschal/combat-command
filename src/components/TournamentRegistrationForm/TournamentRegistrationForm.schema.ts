import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { registrationDetails as flamesOfWarV4 } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { registrationDetails as teamYankeeV2 } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { z } from 'zod';

import {
  Tournament,
  TournamentCompetitorId,
  TournamentId,
  User,
  UserId,
} from '~/api';
import { nameVisibilityChangeRequired } from '~/components/TournamentRegistrationForm/TournamentRegistrationForm.utils';

const getDetailsSchema = (tournament: Tournament) => {
  const options = {
    alignment: !!tournament.registrationDetails?.alignment,
    faction: !!tournament.registrationDetails?.faction,
  };
  switch (tournament.gameSystem) {
    case GameSystem.FlamesOfWarV4:
      return flamesOfWarV4.createSchema(options);
    case GameSystem.TeamYankeeV2:
      return teamYankeeV2.createSchema(options);
    default:
      throw new Error(`Unsupported game system: ${tournament.gameSystem}`);
  }
};

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
  details: getDetailsSchema(tournament),
}).superRefine((values, ctx) => {
  if (tournament.useTeams && !values.tournamentCompetitorId && !values.tournamentCompetitor?.teamName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Select a team or enter a new team name.',
      path: ['tournamentCompetitorId'],
    });
  }
  if (nameVisibilityChangeRequired(tournament, currentUser, values.userId) && !values.nameVisibilityConsent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'This tournament requires real names.',
      path: ['nameVisibilityConsent'],
    });
  }
});

export type SubmitData = z.infer<ReturnType<typeof createSchema>>;

export type FormData = {
  details: {
    alignment: string | null;
    faction: string | null;
  };
  tournamentCompetitor: {
    teamName: string;
  };
  tournamentCompetitorId: TournamentCompetitorId | null;
  tournamentId: TournamentId | null;
  userId: UserId | null;
  nameVisibilityConsent: boolean;
};

export const defaultValues: FormData = {
  details: {
    alignment: null,
    faction: null,
  },
  tournamentCompetitor: {
    teamName: '',
  },
  tournamentCompetitorId: null,
  tournamentId: null,
  userId: null,
  nameVisibilityConsent: false,
};
