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
  type RegistrationStats= Record<Id<'tournamentRegistrations'>, TournamentPlayerMetadata<BaseStats>>;
  type CompetitorStats = Record<Id<'tournamentCompetitors'>, TournamentCompetitorMetadata<BaseStats>>;
  
  // ---- 1. Set-up containers to store all stats ----
  const registrationStats: RegistrationStats = tournamentRegistrations.reduce((acc, registration) => ({
    ...acc,
    [registration._id]: {
      gamesPlayed: 0,
      baseStats: {
        self: [],
        opponent: [],
      },
    } satisfies TournamentPlayerMetadata<BaseStats>,
  }), {});

  const competitorStats: CompetitorStats = tournamentCompetitors.reduce((acc, competitor) => ({
    ...acc,
    [competitor._id]: {
      gamesPlayed: 0,
      playedTables: new Set(),
      byeRounds: new Set(),
      opponentIds: new Set(),
      baseStats: {
        self: [],
        opponent: [],
      },
    } satisfies TournamentCompetitorMetadata<BaseStats>,
  }), {});

  // ---- 2. Extract all relevant information from match results (and their pairings) ----
  type PlayerData = {
    id?: Id<'users'>;
    stats: BaseStats;
  };

  const assignData = (
    self: PlayerData,
    opponent: PlayerData,
    pairing: Doc<'tournamentPairings'>,
  ): void => {
    if (!self.id) {
      return;
    }
    const { registrationId, competitorId } = playerUserIdMap[self.id];

    // Add registration data:
    registrationStats[registrationId].baseStats.self.push(self.stats);
    registrationStats[registrationId].baseStats.opponent.push(opponent.stats);
    registrationStats[registrationId].gamesPlayed += 1;
      
    // Add competitor data:
    competitorStats[competitorId].baseStats.self.push(self.stats);
    competitorStats[competitorId].baseStats.opponent.push(opponent.stats);
    competitorStats[competitorId].gamesPlayed += 1;

    const wasBye = pairing.table === null || !pairing.tournamentCompetitor0Id || !pairing.tournamentCompetitor1Id;
    if (wasBye) {
      competitorStats[competitorId].byeRounds.add(pairing.round);
    }
    if (pairing.table) {
      competitorStats[competitorId].playedTables.add(pairing.table);
    }
    if (opponent.id) {
      competitorStats[competitorId].opponentIds.add(playerUserIdMap[opponent.id].competitorId);
    }
  };

  for (const matchResult of relevantMatchResults) {
    const [player0BaseStats, player1BaseStats] = extractMatchResultStats(matchResult.details);
    const player0Data: PlayerData = {
      id: matchResult.player0UserId,
      stats: player0BaseStats,
    };
    const player1Data: PlayerData = {
      id: matchResult.player1UserId,
      stats: player1BaseStats,
    };
    const tournamentPairing = tournamentPairings.find((r) => r._id === matchResult.tournamentPairingId);
    if (!tournamentPairing) {
      throw new Error('Included a match result which was not part of the pairings!');
    }

    // Process both players:
    assignData(player0Data, player1Data, tournamentPairing);
    assignData(player1Data, player0Data, tournamentPairing);
  }

  // ---- 3. Convert stats to ranking factors for players and competitors ----
  return {
    registrations: Object.entries(registrationStats).map(([id, { baseStats, ...data }]) => ({
      id: id as Id<'tournamentRegistrations'>,
      ...data,
      rankingFactors: computeRankingFactors(baseStats, data.gamesPlayed, defaultBaseStats),
      rank: -1,
    })),
    competitors: Object.entries(competitorStats).map(([id, { baseStats, ...data }]) => ({
      id: id as Id<'tournamentCompetitors'>,
      ...data,
      opponentIds: Array.from(data.opponentIds),
      playedTables: Array.from(data.playedTables),
      byeRounds: Array.from(data.byeRounds),
      rankingFactors: computeRankingFactors(baseStats, data.gamesPlayed, defaultBaseStats),
      rank: -1,
    })),
  };
};
