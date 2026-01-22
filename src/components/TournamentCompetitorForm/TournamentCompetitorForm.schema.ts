import { z } from 'zod';

import {
  ScoreAdjustment,
  TournamentCompetitor,
  TournamentCompetitorId,
  TournamentId,
  UserId,
} from '~/api';
import { scoreAdjustmentSchema } from './components/ScoreAdjustmentFormItem';

export const createSchema = (
  useTeams: boolean,
  otherCompetitors: TournamentCompetitor[] = [],
) => z.object({
  captainUserId: z.string({ message: 'Please select a captain.' }).transform((val) => val as UserId),
  scoreAdjustments: z.array(scoreAdjustmentSchema),
  teamName: z.string(),
  tournamentId: z.string().transform((val) => val as TournamentId),
}).superRefine((data, ctx) => {
  if (useTeams && !data.teamName.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please provide a team name.',
      path: ['teamName'],
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

/**
 * The output of successful form validation.
 */
export type SubmitData = z.infer<ReturnType<typeof createSchema>>;

/**
 * The internal form state before validation (may contain missing or intermediate values).
 */
export type FormData = {
  tournamentCompetitorId: TournamentCompetitorId | null;
  tournamentId: TournamentId | null;
  captainUserId: UserId | null;
  scoreAdjustments: ScoreAdjustment[];
};

export const defaultValues: FormData = {
  tournamentCompetitorId: null,
  tournamentId: null,
  captainUserId: null,
  scoreAdjustments: [],
};
