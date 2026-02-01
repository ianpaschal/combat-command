import { z } from 'zod';

import { Tournament, TournamentId } from '~/api';
import { emptyToUndefined } from '~/utils/emptyToUndefined';

export const createSchema = (tournament: Tournament) => z.object({
  tournamentId: z.string({
    message: 'Please select a tournament.',
  }).transform((val) => val as TournamentId),
  round: z.number().min(0).max(tournament.roundCount - 1),
  method: z.union([z.literal('adjacent'), z.literal('random')]),
  options: z.object({
    allowSameAlignment: emptyToUndefined(z.boolean().optional()),
    allowRepeat: emptyToUndefined(z.boolean().optional()),
  }),
});

export type SubmitData = z.infer<ReturnType<typeof createSchema>>;

export type FormData = {
  tournamentId: TournamentId | null;
  round: number;
  method: 'adjacent' | 'random';
  details: {
    allowSameAlignment: boolean;
    allowRepeat: boolean;
  };
};

export const defaultValues: FormData = {
  tournamentId: null,
  round: 0,
  method: 'random',
  details: {
    allowSameAlignment: true,
    allowRepeat: false,
  },
};
