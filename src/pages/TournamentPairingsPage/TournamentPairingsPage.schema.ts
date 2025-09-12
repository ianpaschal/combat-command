import { z } from 'zod';

import { TournamentCompetitorId } from '~/api';

const tournamentCompetitorIdSchema = z.union([
  z.string().transform((val) => val as TournamentCompetitorId),
  z.null(),
]);

export const draftTournamentPairingSchema = z.object({
  table: z.union([z.number(), z.null()]),
  tournamentCompetitor0Id: tournamentCompetitorIdSchema,
  tournamentCompetitor1Id: tournamentCompetitorIdSchema,
});

export type TournamentPairingFormItem = z.infer<typeof draftTournamentPairingSchema>;

export const schema = z.object({
  pairings: z.array(draftTournamentPairingSchema),
});

export type FormData = z.infer<typeof schema>;

export const sanitize = (
  pairings: unknown[] = [],
  tableCount: number,
): TournamentPairingFormItem[] => {
  const cleanPairings = pairings.map((p) => draftTournamentPairingSchema.parse(p));
  while (cleanPairings.length < tableCount) {
    cleanPairings.push({
      tournamentCompetitor0Id: null,
      tournamentCompetitor1Id: null,
      table: -1,
    });
  }
  return cleanPairings;
};
