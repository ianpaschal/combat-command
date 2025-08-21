import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getTournamentRegistrationsByCompetitor } from '../../tournamentRegistrations';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a tournament competitor by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep tournament competitor.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw tournament competitor document
 * @returns A deep tournament competitor
 */
export const deepenTournamentCompetitor = async (
  ctx: QueryCtx,
  tournamentCompetitor: Doc<'tournamentCompetitors'>,
  results?: {
    playedTables: (number | null)[];
    opponentIds: Id<'tournamentCompetitors'>[];
    byeRounds: number[];
    rank: number;
  },
) => {
  const registrations = await getTournamentRegistrationsByCompetitor(ctx, {
    tournamentCompetitorId: tournamentCompetitor._id,
  });

  return {
    ...tournamentCompetitor,
    ...results,
    registrations,
  };
};

/**
 * Tournament competitor with additional joined data and computed fields.
 */
export type DeepTournamentCompetitor = Awaited<ReturnType<typeof deepenTournamentCompetitor>>;
