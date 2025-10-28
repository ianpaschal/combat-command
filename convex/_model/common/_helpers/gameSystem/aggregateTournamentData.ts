import { GameSystem, getGameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { Doc, Id } from '../../../../_generated/dataModel';
import {
  AnyBaseStats,
  TournamentCompetitorMetadata,
  TournamentCompetitorRanked,
  TournamentPlayerMetadata,
  TournamentPlayerRanked,
} from '../../types';
import { computeRankingFactors } from './computeRankingFactors';

export type TournamentAggregateData<TBaseStats extends AnyBaseStats> = {
  registrations: Omit<TournamentPlayerRanked<TBaseStats>, 'rank'>[];
  competitors: Omit<TournamentCompetitorRanked<TBaseStats>, 'rank'>[];
};

/**
 * Aggregates all tournament data for a tournament, organized by competitor and player/registration.
 * 
 * @param ctx - Convex query context
 * @param tournamentId - ID of the tournament
 * @returns Calculated results for a tournament, by competitor and player/registration
 */
export const aggregateTournamentData = (
  gameSystem: GameSystem,
  data: {
    tournamentRegistrations: Doc<'tournamentRegistrations'>[],
    tournamentCompetitors: Doc<'tournamentCompetitors'>[],
    tournamentPairings: Doc<'tournamentPairings'>[],
    matchResults: Doc<'matchResults'>[],
  },
): TournamentAggregateData<AnyBaseStats> => {
  // For faster look-up:
  const playerUserIdMap = data.tournamentRegistrations.reduce((acc, registration) => ({
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

  const { extractMatchResultStats, defaultBaseStats } = getGameSystem(gameSystem);
  type BaseStats = typeof defaultBaseStats;
  type RegistrationStats= Record<Id<'tournamentRegistrations'>, TournamentPlayerMetadata<BaseStats>>;
  type CompetitorStats = Record<Id<'tournamentCompetitors'>, TournamentCompetitorMetadata<BaseStats>>;
  
  // ---- 1. Set-up containers to store all stats ----
  const registrationStats: RegistrationStats = data.tournamentRegistrations.reduce((acc, registration) => ({
    ...acc,
    [registration._id]: {
      gamesPlayed: 0,
      baseStats: {
        self: [],
        opponent: [],
      },
    } satisfies TournamentPlayerMetadata<BaseStats>,
  }), {});

  const competitorStats: CompetitorStats = data.tournamentCompetitors.reduce((acc, competitor) => ({
    ...acc,
    [competitor._id]: {
      gamesPlayed: 0,
      playedTables: [],
      byeRounds: [],
      opponentIds: [],
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
      competitorStats[competitorId].byeRounds.push(pairing.round);
    }
    if (pairing.table) {
      competitorStats[competitorId].playedTables.push(pairing.table);
    }
    if (opponent.id) {
      competitorStats[competitorId].opponentIds.push(playerUserIdMap[opponent.id].competitorId);
    }
  };

  for (const matchResult of data.matchResults) {
    const [player0BaseStats, player1BaseStats] = extractMatchResultStats(matchResult.details);
    const player0Data: PlayerData = {
      id: matchResult.player0UserId,
      stats: player0BaseStats,
    };
    const player1Data: PlayerData = {
      id: matchResult.player1UserId,
      stats: player1BaseStats,
    };
    const tournamentPairing = data.tournamentPairings.find((r) => r._id === matchResult.tournamentPairingId);
    if (!tournamentPairing) {
      throw new Error('Included a match result which was not part of the pairings!');
    }

    // Process both players:
    assignData(player0Data, player1Data, tournamentPairing);
    assignData(player1Data, player0Data, tournamentPairing);
  }

  // ---- 3. Convert stats to ranking factors for players and competitors ----
  return {
    registrations: Object.entries(registrationStats).map(([id, data]) => ({
      id: id as Id<'tournamentRegistrations'>,
      ...data,
      rankingFactors: computeRankingFactors(data, defaultBaseStats),
    })),
    competitors: Object.entries(competitorStats).map(([id, data]) => ({
      id: id as Id<'tournamentCompetitors'>,
      ...data,
      rankingFactors: computeRankingFactors(data, defaultBaseStats),
    })),
  };
};
