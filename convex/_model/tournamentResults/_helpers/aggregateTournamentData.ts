import { getGameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { computeRankingFactors } from '../../common/_helpers/gameSystem/computeRankingFactors';
import {
  TournamentAggregateData,
  TournamentCompetitorMetadata,
  TournamentPlayerMetadata,
} from '../types';

/**
 * Aggregates all tournament data for a tournament, organized by competitor and player/registration.
 * 
 * @param ctx - Convex query context
 * @param tournamentId - ID of the tournament
 * @param round - Round index
 * @returns Calculated results for a tournament, by competitor and player/registration
 */
export const aggregateTournamentData = async (
  ctx: QueryCtx,
  tournament: Doc<'tournaments'>,
  round: number,
): Promise<TournamentAggregateData> => {

  // ---- GATHER DATABASE RECORDS ----
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', tournament._id))
    .collect();
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournament._id))
    .collect();
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournament._id))
    .filter((q) => q.lte(q.field('round'), round))
    .collect();
  const relevantTournamentPairingIds = tournamentPairings.map((r) => r._id);
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournament._id))
    .collect();
  const relevantMatchResults = matchResults.filter((r) => (
    r.tournamentPairingId && relevantTournamentPairingIds.includes(r.tournamentPairingId)
  ));

  // For faster look-up:
  const playerUserIdMap = tournamentRegistrations.reduce((acc, registration) => ({
    ...acc,
    [registration.userId]: {
      registrationId: registration._id,
      competitorId: registration.tournamentCompetitorId,
    },
  }), {} as Record<Id<'users'>, {
    registrationId: Id<'tournamentRegistrations'>;
    competitorId: Id<'tournamentCompetitors'>
  }>);
  
  // Game system specifics:
  const { extractMatchResultStats, defaultBaseStats } = getGameSystem(tournament.gameSystem);
  type BaseStats = typeof defaultBaseStats;
  
  // ---- 1. Set-up containers to store all stats ----
  const registrationStats = tournamentRegistrations.reduce((acc, registration) => ({
    ...acc,
    [registration._id]: {
      results: [],
    } satisfies TournamentPlayerMetadata<BaseStats>,
  }), {} as Record<Id<'tournamentRegistrations'>, TournamentPlayerMetadata<BaseStats>>);

  const competitorStats = tournamentCompetitors.reduce((acc, competitor) => ({
    ...acc,
    [competitor._id]: {
      results: [],
      byeRounds: new Set(),
      playedTables: new Set(),
    } satisfies TournamentCompetitorMetadata<BaseStats>,
  }), {} as Record<Id<'tournamentCompetitors'>, TournamentCompetitorMetadata<BaseStats>>);

  // ---- 2. Extract all relevant information from match results (and their pairings) ----
  for (const matchResult of relevantMatchResults) {
    const {
      player0UserId,
      player1UserId,
      tournamentPairingId,
      details,
    } = matchResult;
    
    const tournamentPairing = tournamentPairings.find((r) => r._id === tournamentPairingId);
    if (!tournamentPairing) {
      throw new Error('Included a match result which was not part of the pairings!');
    }

    const wasBye = tournamentPairing.table === null || !tournamentPairing.tournamentCompetitor0Id || !tournamentPairing.tournamentCompetitor1Id;
    const stats = extractMatchResultStats(details);

    [player0UserId, player1UserId].forEach((userId, i) => {
      if (!userId) {
        return;
      }
      const opponentUserId = userId === player0UserId ? player1UserId : player0UserId;
      const { registrationId, competitorId } = playerUserIdMap[userId];
      registrationStats[registrationId].results.push({
        ...stats[i],
        opponentId: opponentUserId ? playerUserIdMap[opponentUserId].registrationId : null,
      });
      competitorStats[competitorId].results.push({
        ...stats[i],
        opponentId: opponentUserId ? playerUserIdMap[opponentUserId].competitorId : null,
      });
      if (wasBye) {
        competitorStats[competitorId].byeRounds.add(tournamentPairing.round);
      }
      if (!wasBye && typeof tournamentPairing.table === 'number') {
        competitorStats[competitorId].playedTables.add(tournamentPairing.table);
      }
    });
  }

  // ---- 3. Convert stats to ranking factors for players and competitors ----
  return {
    registrations: Object.entries(registrationStats).map(([key, { results }]) => {
      const id = key as Id<'tournamentRegistrations'>;
      return {
        id,
        gamesPlayed: results.length,
        opponentIds: Array.from(new Set(results.map((s) => s.opponentId))).filter((id) => id !== null),
        rankingFactors: computeRankingFactors(id, registrationStats, defaultBaseStats, round),
        rank: -1,
      };
    }),
    competitors: Object.entries(competitorStats).map(([key, {
      playedTables,
      byeRounds,
      results,
    }]) => {
      const id = key as Id<'tournamentCompetitors'>;
      return {
        id,
        gamesPlayed: results.length,
        opponentIds: Array.from(new Set(results.map((s) => s.opponentId))).filter((id) => id !== null),
        playedTables: Array.from(playedTables),
        byeRounds: Array.from(byeRounds),
        rankingFactors: computeRankingFactors(id, competitorStats, defaultBaseStats, round),
        rank: -1,
      };
    }),
  };
};
