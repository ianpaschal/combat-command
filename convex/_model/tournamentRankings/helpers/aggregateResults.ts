import { ConvexError } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { calculateMatchScore } from '../../fowV4/calculateMatchScore';
import { getMatchResultsByTournamentPairing } from '../../matchResults/getMatchResultsByTournamentPairing';
import { getTournamentCompetitorsByTournamentId } from '../../tournamentCompetitors/helpers';
import { getTournamentPairingsByTournamentId } from '../../tournamentPairings/helpers';
import { ResultData } from '../types';

/**
 * Aggregates two result sets for a tournament, one for competitors and (optionally) one for
 * individual players. Each set contains arrays of match results in the form of wins, points, units
 * destroyed and lost, indexed by competitor IDs (either tournamentCompetitor or user).
 * 
 * @param ctx 
 * @param id 
 * @param round 
 * @param includePlayerResults 
 * @returns 
 */
export const aggregateResults = async (
  ctx: QueryCtx,
  id: Id<'tournaments'>,
  round: number,
  includePlayerResults?: boolean,
) => {
  const competitors = await getTournamentCompetitorsByTournamentId(ctx, id);
  const pairings = await getTournamentPairingsByTournamentId(ctx, id);
  const relevantPairings = pairings.filter((p) => p.round <= round);

  const competitorResults: Record<Id<'tournamentCompetitors'>, (ResultData & { opponentId: Id<'tournamentCompetitors'> })[]> = {};

  const playerResults: Record<Id<'users'>, (ResultData & { opponentId: Id<'users'> })[]> = {};

  for (const pairing of relevantPairings) {
    const matchResults = await getMatchResultsByTournamentPairing(ctx, pairing._id);

    const competitor0 = competitors.find((c) => c._id === pairing.tournamentCompetitor0Id);
    const competitor1 = competitors.find((c) => c._id === pairing.tournamentCompetitor1Id);
    if (!competitor0 || !competitor1) {
      throw new ConvexError(getErrorMessage('TOURNAMENT_RANKINGS_PAIRING_MISSING_COMPETITOR'));
    }

    const competitor0PlayerUserIds = new Set(competitor0.players.map((p) => p.userId));

    matchResults.forEach((matchResult) => {
      const { player0UserId, player1UserId, details } = matchResult;
      if (!player0UserId || !player1UserId) {
        throw new ConvexError(getErrorMessage('TOURNAMENT_RANKINGS_MATCH_RESULT_MISSING_PLAYER'));
        // TODO: Remove this error, add support for placeholders 
      }

      // Calculate competitor IDs for each player in the match
      const isPlayer0Competitor0 = competitor0PlayerUserIds.has(player0UserId);
      const player0CompetitorId = isPlayer0Competitor0 ? competitor0._id : competitor1._id;
      const player1CompetitorId = isPlayer0Competitor0 ? competitor1._id : competitor0._id;
      const score = calculateMatchScore(matchResult);

      // For each player/competitor in the match...
      [player0CompetitorId, player1CompetitorId].forEach((competitorId, i) => {

        // Calculate their performance
        const baseResult: ResultData = {
          wins: details.winner === i ? 1 : 0,
          points: score[i],
          unitsDestroyed: i === 0 ? details.player1UnitsLost : details.player0UnitsLost,
          unitsLost: i === 0 ? details.player0UnitsLost : details.player1UnitsLost,
        };

        // Add their performance to their competitor
        if (!competitorResults[competitorId]) {
          competitorResults[competitorId] = [];
        }
        competitorResults[competitorId].push({
          ...baseResult,
          opponentId: i === 0 ? player1CompetitorId : player0CompetitorId,
        });

        // Add their performance to themselves
        if (includePlayerResults) {
          const userId = i === 0 ? player0UserId : player1UserId;
          if (!playerResults[userId]) {
            playerResults[userId] = [];
          }
          playerResults[userId].push({
            ...baseResult,
            opponentId: i === 0 ? player1UserId : player0UserId,
          });
        }
      });
    });
  }

  return {
    competitors: competitorResults,
    players: includePlayerResults ? playerResults : undefined,
  };
};
