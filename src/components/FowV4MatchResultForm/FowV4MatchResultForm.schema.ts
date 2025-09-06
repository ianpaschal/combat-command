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

export const fowV4MatchResultDetailsSchema = z.object({
  // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
  player0BattlePlan: z.nativeEnum(BattlePlan, {
    errorMap: () => ({ message: 'Please select a battle plan.' }),
  }),
  player0Faction: z.nativeEnum(Faction, {
    errorMap: () => ({ message: 'Please select a faction.' }),
  }),
  player0UnitsLost: z.coerce.number(),
  player1BattlePlan: z.nativeEnum(BattlePlan, {
    errorMap: () => ({ message: 'Please select a battle plan.' }),
  }),
  player1Faction: z.nativeEnum(Faction, {
    errorMap: () => ({ message: 'Please select a faction.' }),
  }),
  player1UnitsLost: z.coerce.number(),

  // Handled by <CommonForm />
  attacker: z.union([z.literal(0), z.literal(1)], { message: 'Please select an attacker.' }),
  firstTurn: z.union([z.literal(0), z.literal(1)], { message: 'Please select who had the first turn.' }),
  mission: z.nativeEnum(MissionName, {
    errorMap: () => ({ message: 'Please select a mission.' }),
  }),
  outcomeType: z.enum(Object.values(MatchOutcomeType) as [MatchOutcomeType, ...MatchOutcomeType[]], {
    message: 'Please select an outcome type.',
  }),
  turnsPlayed: z.coerce.number({ message: 'Please enter a number of turns' }).min(1),
  winner: z.union([z.literal(-1), z.literal(0), z.literal(1)], { message: 'Please select a winner.' }),
  scoreOverride: z.optional(z.object({
    player0Score: z.coerce.number({ message: 'Please enter a score' }),
    player1Score: z.coerce.number({ message: 'Please enter a score' }),
  })),
});

export const fowV4MatchResultFormSchema = z.object({

  // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
  player0Placeholder: z.optional(z.string()),
  player0UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),
  player1Placeholder: z.optional(z.string()),
  player1UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),

  details: fowV4MatchResultDetailsSchema,
  gameSystemConfig: fowV4GameSystemConfigFormSchema,

  // Non-editable
  gameSystem: z.nativeEnum(GameSystem),
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

export type FowV4MatchResultSubmitData = z.infer<typeof fowV4MatchResultFormSchema>;

export type FowV4MatchResultFormData = DeepPartial<FowV4MatchResultSubmitData>;

export const defaultValues: DeepPartial<MatchResult> = {
  details: {
    player0UnitsLost: undefined,
    player1UnitsLost: undefined,
    attacker: undefined,
    firstTurn: undefined,
    mission: undefined,
    outcomeType: undefined,
    turnsPlayed: undefined,
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
