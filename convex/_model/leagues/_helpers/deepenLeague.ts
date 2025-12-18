import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';
import { getLeagueOrganizersByLeague } from '../../leagueOrganizers';
import { LeagueRanking } from '../../leagueRankings';
import { checkTournamentVisibility } from '../../tournaments/_helpers/checkTournamentVisibility';
import { getUser } from '../../users';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a League by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep League.
 * 
 * @param ctx - Convex query context
 * @param league - Raw League document
 * @returns A deep League
 */
export const deepenLeague = async (
  ctx: QueryCtx,
  doc: Doc<'leagues'>,
  includeRankings?: number,
) => {
  const logoUrl = await getStorageUrl(ctx, doc.logoStorageId);
  const bannerUrl = await getStorageUrl(ctx, doc.bannerStorageId);

  const organizers = await getLeagueOrganizersByLeague(ctx, {
    leagueId: doc._id,
  });

  const tournaments = [];

  for (const tournamentId of doc.tournamentIds) {
    const tournament = await ctx.db.get(tournamentId);
    if (!tournament || !checkTournamentVisibility(ctx, tournament)) {
      continue;
    }
    tournaments.push({
      id: tournament._id,
      title: tournament.title,
      editionYear: tournament.editionYear,
      logoUrl: await getStorageUrl(ctx, tournament.logoStorageId),
      logoWrapper: tournament.logoWrapper,
      startsAt: tournament.startsAt,
    });
  }

  const rankings: LeagueRanking[] = [];
  if (includeRankings) {
    const leagueRankings = await ctx.db.query('leagueRankings')
      .withIndex('by_league', (q) => q.eq('leagueId', doc._id))
      .order('asc')
      .take(includeRankings);
    
    for (const leagueRanking of leagueRankings) {
      const user = await getUser(ctx, { id: leagueRanking.userId });
      rankings.push({ ...leagueRanking, user });
    }
  }

  return {
    ...doc,
    rankings,
    organizers,
    tournaments: tournaments.sort((a, b) => a.startsAt - b.startsAt),
    bannerUrl,
    logoUrl,
  };
};
