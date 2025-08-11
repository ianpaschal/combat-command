import { DeepPartial } from 'react-hook-form';
import { GameSystem } from '@ianpaschal/combat-command-static-data/common';
import {
  BattlePlan,
  Faction,
  MatchOutcomeType,
  MissionName,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { z } from 'zod';

import { MatchResult, UserId } from '~/api';
import { fowV4GameSystemConfigDefaultValues, fowV4GameSystemConfigFormSchema } from './components/GameConfigFields.schema';

export const fowV4MatchResultFormSchema = z.object({

  // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
  player0Placeholder: z.optional(z.string()),
  player0UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),
  player1Placeholder: z.optional(z.string()),
  player1UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),

  details: z.object({
    // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
    player0BattlePlan: z.string({ message: 'Please select a battle plan.' }).transform((val) => val as BattlePlan),
    player0FactionId: z.optional(z.string({ message: 'Please select a faction.' }).transform((val) => val as Faction)),
    player0UnitsLost: z.coerce.number(),
    player1BattlePlan: z.string({ message: 'Please select a battle plan.' }).transform((val) => val as BattlePlan),
    player1FactionId: z.optional(z.string({ message: 'Please select a faction.' }).transform((val) => val as Faction)),
    player1UnitsLost: z.coerce.number(),

    // Handled by <CommonForm />
    attacker: z.union([z.literal(0), z.literal(1)], { message: 'Please select an attacker.' }),
    firstTurn: z.union([z.literal(0), z.literal(1)], { message: 'Please who had the first turn.' }),
    mission: z.string({ message: 'Please select a mission.' }).transform((val) => val as MissionName),
    outcomeType: z.enum(Object.values(MatchOutcomeType) as [MatchOutcomeType, ...MatchOutcomeType[]], {
      message: 'Please select an outcome type.',
    }),
    turnsPlayed: z.coerce.number().min(1),
    winner: z.union([z.literal(-1), z.literal(0), z.literal(1)], { message: 'Please select a winner.' }),
  }),

  gameSystemConfig: fowV4GameSystemConfigFormSchema,

  // Non-editable
  gameSystem: z.string().transform((val) => val as GameSystem),
  playedAt: z.union([z.string(), z.number()]), // TODO: not visible, enable later
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
    mission: undefined,
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
  gameSystem: GameSystem.FlamesOfWarV4,
  gameSystemConfig: fowV4GameSystemConfigDefaultValues,
  playedAt: new Date().toISOString(),
};
