import { DeepPartial } from 'react-hook-form';
import { GameSystem, getGameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { matchResultDetails as flamesOfWarV4MatchResultDetails } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { z } from 'zod';

import { MatchResult, UserId } from '~/api';
import { getGameSystemConfigDefaultValues } from '~/components/GameSystemConfigFields';

export const getMatchResultFormSchema = (gameSystem: GameSystem) => {
  const { matchResultDetails, gameSystemConfig } = getGameSystem(gameSystem);
  return z.object({

    // Handled by <TournamentPlayersForm /> or <SingleMatchPlayersForm />
    player0Placeholder: z.optional(z.string()),
    player0UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),
    player1Placeholder: z.optional(z.string()),
    player1UserId: z.optional(z.string().transform((val) => val.length ? val as UserId : undefined)),

    // Non-editable
    gameSystem: z.nativeEnum(GameSystem),
    playedAt: z.union([z.string(), z.number()]), // TODO: not visible, enable later
  }).extend({
    details: matchResultDetails.schema,
    gameSystemConfig: gameSystemConfig.schema,
  });
};

export type MatchResultSubmitData = z.infer<ReturnType<typeof getMatchResultFormSchema>>;

export type MatchResultFormData = DeepPartial<MatchResultSubmitData>;

export const defaultValues: DeepPartial<MatchResult> = {
  details: flamesOfWarV4MatchResultDetails.defaultValues,
  player0Placeholder: '',
  player0UserId: '' as UserId,
  player1Placeholder: '',
  player1UserId: '' as UserId,
  gameSystem: GameSystem.FlamesOfWarV4,
  gameSystemConfig: getGameSystemConfigDefaultValues(GameSystem.FlamesOfWarV4),
  playedAt: Date.now(),
};
