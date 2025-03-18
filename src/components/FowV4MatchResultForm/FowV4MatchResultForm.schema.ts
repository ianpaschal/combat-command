import { DeepPartial } from 'tsdef';
import { z } from 'zod';

import {
  FowV4BattlePlan,
  FowV4FactionId,
  fowV4MatchOutcomeTypeValues,
  FowV4MissionId,
  GameSystemId,
  MatchResult,
  UserId,
} from '~/api';
import { fowV4GameSystemConfigSchema } from '~/types/fowV4/fowV4GameSystemConfigSchema';

export const fowV4MatchResultFormSchema = z.object({

  // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
  player0Placeholder: z.optional(z.string()),
  player0UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),
  player1Placeholder: z.optional(z.string()),
  player1UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),

  details: z.object({
    // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
    player0BattlePlan: z.string({ message: 'Please select a battle plan.' }).transform((val) => val as FowV4BattlePlan),
    player0FactionId: z.string({ message: 'Please select a faction.' }).transform((val) => val as FowV4FactionId),
    player0UnitsLost: z.number(),
    player1BattlePlan: z.string({ message: 'Please select a battle plan.' }).transform((val) => val as FowV4BattlePlan),
    player1FactionId: z.string({ message: 'Please select a faction.' }).transform((val) => val as FowV4FactionId),
    player1UnitsLost: z.number(),

    // Handled by <CommonForm />
    attacker: z.union([z.literal(0), z.literal(1)], { message: 'Please select an attacker.' }),
    firstTurn: z.union([z.literal(0), z.literal(1)], { message: 'Please who had the first turn.' }),
    missionId: z.string({ message: 'Please select a mission.' }).transform((val) => val as FowV4MissionId),
    outcomeType: z.enum(fowV4MatchOutcomeTypeValues, { message: 'Please select an outcome type.' }),
    turnsPlayed: z.number().min(1),
    winner: z.union([z.literal(-1), z.literal(0), z.literal(1)], { message: 'Please select a winner.' }),
  }),

  gameSystemConfig: fowV4GameSystemConfigSchema,

  // Non-editable
  gameSystemId: z.string().transform((val) => val as GameSystemId),
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
  gameSystemId: 'flames_of_war_v4',
  gameSystemConfig: {
    dynamicPointsVersionId: undefined,
    eraId: 'flames_of_war_v4::era::late_war',
    points: 100,
    lessonsFromTheFrontVersionId: 'flames_of_war_v4::lessons_from_the_front_version::2024_03',
    missionMatrixId: 'flames_of_war_v4::mission_matrix::2023_04_extended',
    missionPackId: 'flames_of_war_v4::mission_pack::2023_04',
    useExperimentalMissions: true,
  },
};
