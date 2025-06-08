import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getRange, Range } from '../_helpers/getRange';
import { getMatchResultsByTournament } from '../matchResults/getMatchResultsByTournament';
import { getTournamentCompetitorListByTournamentId } from '../tournamentCompetitors';
import { getTournamentPairings } from '../tournamentPairings';
import { createFowV4TournamentExtendedStatMap } from './createFowV4TournamentExtendedStatMap';
import { createTournamentCompetitorMetaMap } from './createTournamentCompetitorMetaMap';
import { divideFowV4BaseStats } from './divideFowV4BaseStats';
import { extractFowV4MatchResultBaseStats } from './extractFowV4MatchResultBaseStats';
import { flattenFowV4StatMap } from './flattenFowV4StatMap';
import { sumFowV4BaseStats } from './sumFowV4BaseStats';
import { FowV4TournamentDiscretePlayerStats } from './types';

export type AggregateFowV4TournamentData = Awaited<ReturnType<typeof aggregateFowV4TournamentData>>;

/**
 * 
 * @param ctx 
 * @param tournamentId 
 * @param range 
 * @returns 
 */
export const aggregateFowV4TournamentData = async (
  ctx: QueryCtx,
  tournamentId: Id<'tournaments'>,
  range?: Range | number,
) => {
  // ---- 1. Gather base data ----
  const tournamentCompetitors = await getTournamentCompetitorListByTournamentId(ctx, { tournamentId }); // TODO: No reason to get them not-by-tournament
  const tournamentPairings = await getTournamentPairings(ctx, { tournamentId });
  const matchResults = await getMatchResultsByTournament(ctx, { tournamentId });

  // ---- End of async portion ----

  // ---- 2. Set-up containers to store all stats ----
  const tournamentCompetitorIds = tournamentCompetitors.map((c) => c._id);
  const tournamentPlayerIds = Array.from(new Set(tournamentCompetitors.reduce((acc, c) => [
    ...acc,
    ...c.players.map((p) => p.user._id),
  ], [] as Id<'users'>[])));
  // TODO: Replace the above with a re-usable function

  const rawPlayerStats: Record<Id<'users'>, FowV4TournamentDiscretePlayerStats> = tournamentPlayerIds.reduce((acc, id) => ({
    ...acc,
    [id]: { self: [], opponent: [] },
  }), {} as Record<Id<'users'>, FowV4TournamentDiscretePlayerStats>);

  const playerStats = createFowV4TournamentExtendedStatMap(tournamentPlayerIds);
  const competitorStats = createFowV4TournamentExtendedStatMap(tournamentCompetitorIds);
  const competitorMeta = createTournamentCompetitorMetaMap(tournamentCompetitorIds);
    
  // ---- 3. Filter data to relevant portions ----
  const { min: minRound, max: maxRound } = getRange(range);
  const relevantTournamentPairings = tournamentPairings.filter((tournamentPairing) => (
    tournamentPairing.round >= minRound && tournamentPairing.round <= maxRound
  ));
  const relevantTournamentPairingIds = relevantTournamentPairings.map((p) => p._id);
  const relevantMatchResults = matchResults.filter(({ tournamentPairingId }) => (
    tournamentPairingId && relevantTournamentPairingIds.includes(tournamentPairingId)
  ));

  // ---- 4. Aggregate base stats per player using match results ----
  for (const matchResult of relevantMatchResults) {
    const [player0BaseStats, player1BaseStats] = extractFowV4MatchResultBaseStats(matchResult);
    if (matchResult.player0UserId) {
      rawPlayerStats[matchResult.player0UserId].self.push(player0BaseStats);
      rawPlayerStats[matchResult.player0UserId].opponent.push(player1BaseStats);
    }
    if (matchResult.player1UserId) {
      rawPlayerStats[matchResult.player1UserId].self.push(player1BaseStats);
      rawPlayerStats[matchResult.player1UserId].opponent.push(player0BaseStats);
    }
  }

  // ---- 5. Aggregate metadata per competitor using pairings ----
  for (const tournamentPairing of relevantTournamentPairings) {
    const {
      round,
      table,
      tournamentCompetitor0Id,
      tournamentCompetitor1Id,
    } = tournamentPairing;
    const wasBye = !table || !tournamentCompetitor1Id;
    if (wasBye) {
      competitorMeta[tournamentCompetitor0Id].byeRounds.push(round);
    } else {
      competitorMeta[tournamentCompetitor0Id].opponentIds.push(tournamentCompetitor1Id);
      competitorMeta[tournamentCompetitor0Id].playedTables.push(table);
      competitorMeta[tournamentCompetitor1Id].opponentIds.push(tournamentCompetitor0Id);
      competitorMeta[tournamentCompetitor1Id].playedTables.push(table);
    }   
  }

  // ---- 6. Aggregate stats for each player ----
  for (const id of tournamentPlayerIds) {
    const gamesPlayed = rawPlayerStats[id].self.length;
    const total = sumFowV4BaseStats(rawPlayerStats[id].self);
    const total_opponent = sumFowV4BaseStats(rawPlayerStats[id].opponent);
    playerStats[id] = {
      total,
      total_opponent,
      average: divideFowV4BaseStats(total, gamesPlayed),
      average_opponent: divideFowV4BaseStats(total_opponent, gamesPlayed),
      gamesPlayed,
    };
  }

  // ---- 7. Compute stats for each competitor ----
  for (const tournamentCompetitor of tournamentCompetitors) {
    const id = tournamentCompetitor._id;
    const gamesPlayed = tournamentCompetitor.players.reduce((acc, { user }) => (
      acc + playerStats[user._id].gamesPlayed
    ), 0);
    const total = sumFowV4BaseStats(tournamentCompetitor.players.map(({ user }) => (
      playerStats[user._id].total
    )));
    const total_opponent = sumFowV4BaseStats(tournamentCompetitor.players.map(({ user }) => (
      playerStats[user._id].total_opponent
    )));
    competitorStats[id] = {
      total,
      total_opponent,
      average: divideFowV4BaseStats(total, gamesPlayed),
      average_opponent: divideFowV4BaseStats(total_opponent, gamesPlayed),
      gamesPlayed,
    };
  }

  return {
    players: flattenFowV4StatMap(playerStats).map(({ id, stats }) => ({
      id,
      stats,
    })),
    competitors: flattenFowV4StatMap(competitorStats).map(({ id, stats }) => ({
      id,
      stats,
      ...competitorMeta[id],
    })),
  };
};
