import { DeepPartial } from 'tsdef';
import { z } from 'zod';

import {
  fowV4MatchOutcomeTypeValues,
  FowV4MissionId,
  FowV4MissionMatrixId,
  FowV4MissionPackId,
  GameSystem,
  MatchResult,
  UserId,
} from '~/api';
import { fowV4BattlePlanSchema } from '~/types/fowV4/fowV4BattlePlanSchema';

export const fowV4MatchResultFormSchema = z.object({

  // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
  player0Placeholder: z.optional(z.string()),
  player0UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),
  player1Placeholder: z.optional(z.string()),
  player1UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),

  details: z.object({
    // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
    player1BattlePlan: fowV4BattlePlanSchema,
    player1UnitsLost: z.number(),
    player0UnitsLost: z.number(),
    player0BattlePlan: fowV4BattlePlanSchema,

    // Handled by <CommonForm />
    attacker: z.union([z.literal(0), z.literal(1)], { message: 'Please select an attacker.' }),
    firstTurn: z.union([z.literal(0), z.literal(1)], { message: 'Please who had the first turn.' }),
    missionId: z.string({ message: 'Please select a mission.' }).transform((val) => val as FowV4MissionId),
    outcomeType: z.enum(fowV4MatchOutcomeTypeValues, { message: 'Please select an outcome type.' }),
    turnsPlayed: z.number().min(1),
    winner: z.union([z.literal(-1), z.literal(0), z.literal(1)], { message: 'Please select a winner.' }),
  }),

  gameSystemConfig: z.object({
    // Handled by <GameConfigForm />
    era: z.string(),
    points: z.number(),

    // Advanced option (hidden by default)
    
    lessonsFromTheFrontVersion: z.string(),

    // Non-editable
    dynamicPointsVersion: z.optional(z.string()),
    missionMatrixId: z.string().transform((val) => val as FowV4MissionMatrixId),
    missionPackId: z.string().transform((val) => val as FowV4MissionPackId),
    useExperimentalMissions: z.optional(z.boolean()),
  }),

  // Non-editable
  gameSystem: z.string().transform((val) => val as GameSystem),
}).superRefine((values, ctx) => {
  if (values.details.outcomeType !== 'time_out' && values.details.winner === undefined) {
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

export const defaultValues: DeepPartial<MatchResult> = {
  details: {
    player0UnitsLost: 0,
    player1UnitsLost: 0,
    attacker: undefined,
    firstTurn: undefined,
    missionId: undefined,
    outcomeType: undefined,
    turnsPlayed: 1,
    winner: undefined,
    player0BattlePlan: undefined,
    player1BattlePlan: undefined,
  },
  player0Placeholder: '',
  player0UserId: '' as UserId,
  player1Placeholder: '',
  player1UserId: '' as UserId,
  gameSystem: 'flames_of_war_4th_edition',
  gameSystemConfig: {
    era: 'lw',
    points: 100,
    dynamicPointsVersion: '6cb1a1a6-9f8d-44f3-8423-2f896ee372f6',
    lessonsFromTheFrontVersion: 'b8d046fa-8040-4c22-891a-b1a33c94fd87',
    missionMatrixId: '00e2a46a-8959-46bd-b468-736bc47945f5' as FowV4MissionMatrixId, // April 2023 (Extended)
    missionPackId: '6824a95b-c582-4c6b-b518-29e9ee0577af' as FowV4MissionPackId, // April 2023
    useExperimentalMissions: true,
  },
};
