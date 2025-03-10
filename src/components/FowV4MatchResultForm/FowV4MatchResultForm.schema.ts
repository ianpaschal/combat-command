import { Id } from 'convex/_generated/dataModel';
import { z } from 'zod';

import { GameSystem, UserId } from '~/api';
import { fowV4BattlePlanSchema } from '~/types/fowV4/fowV4BattlePlanSchema';
import { fowV4MatchOutcomeTypeSchema } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';

export const fowV4MatchResultFormSchema = z.object({

  // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
  player0BattlePlan: fowV4BattlePlanSchema,
  player0Placeholder: z.optional(z.string()),
  player0UnitsLost: z.number(),
  player0UserId: z.optional(z.string().transform((val) => val as UserId)),
  player1BattlePlan: fowV4BattlePlanSchema,
  player1Placeholder: z.optional(z.string()),
  player1UnitsLost: z.number(),
  player1UserId: z.optional(z.string().transform((val) => val as UserId)),

  // Handled by <GameConfigForm />
  era: z.string(),
  points: z.number(),
  // Advanced option (hidden by default)
  dynamicPointsVersion: z.optional(z.string()),
  lessonsFromTheFrontVersion: z.string(),

  // Handled by <CommonForm />
  attacker: z.union([z.literal(0), z.literal(1)], { message: 'Please select an attacker.' }),
  firstTurn: z.union([z.literal(0), z.literal(1)], { message: 'Please who had the first turn.' }),
  missionId: z.string({ message: 'Please select a mission.' }).transform((val) => val as Id<'fowV4Missions'>),
  outcomeType: fowV4MatchOutcomeTypeSchema,
  turnsPlayed: z.number().min(1),
  winner: z.union([z.literal(0), z.literal(1), z.null()], { message: 'Please a winner.' }),

  // Non-editable
  gameSystem: z.string().transform((val) => val as GameSystem),
  missionMatrixId: z.string().transform((val) => val as Id<'fowV4MissionMatrixes'>),
  missionPackId: z.string().transform((val) => val as Id<'fowV4MissionPacks'>),
  useExperimentalMissions: z.boolean(),
}).superRefine((values, ctx) => {
  if (values.outcomeType !== 'time_out' && values.winner === undefined) {
    ctx.addIssue({
      message: 'Please select a winner',
      code: z.ZodIssueCode.custom,
      path: ['winner'],
    });
  }

  // TODO: Verify that at least user or placeholder is filled in for each player
  // TODO: Verify that game system config and details match game system
});

export type FowV4MatchResultFormData = z.infer<typeof fowV4MatchResultFormSchema>;

export const defaultValues: Partial<FowV4MatchResultFormData> = {
  player0BattlePlan: undefined,
  player0Placeholder: '',
  player0UnitsLost: 0,
  player0UserId: undefined,
  player1BattlePlan: undefined,
  player1Placeholder: '',
  player1UnitsLost: 0,
  player1UserId: undefined,
  era: 'lw',
  points: 100,
  dynamicPointsVersion: 'dynamic_points_2025_01',
  lessonsFromTheFrontVersion: 'lessons_from_the_front_2024_03',
  attacker: undefined,
  firstTurn: undefined,
  missionId: undefined,
  outcomeType: undefined,
  turnsPlayed: undefined,
  winner: undefined,
  gameSystem: 'flames_of_war_4th_edition',
  missionMatrixId: 'm57dw693qe6pk69b796e8jdgh57bpwsq' as Id<'fowV4MissionMatrixes'>, // April 2023 (Extended)
  missionPackId: 'm977z1d2dpedgqzgtx1jw7q7p17bqk5a' as Id<'fowV4MissionPacks'>, // April 2023
  useExperimentalMissions: true,
};
