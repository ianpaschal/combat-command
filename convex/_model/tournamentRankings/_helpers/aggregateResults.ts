import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { calculateMatchScore } from '../../fowV4/calculateMatchScore';
import { getMatchResultsByTournamentPairing } from '../../matchResults/getMatchResultsByTournamentPairing';
import { getTournamentCompetitorsByTournamentId } from '../../tournamentCompetitors/helpers';
import { getTournamentPairingsByTournamentId } from '../../tournamentPairings/helpers';
import { AggregateRoundResults, ResultData } from '../types';
import { getPlayerCompetitorId } from './getPlayerCompetitorId';

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

  const competitorResults = competitors.reduce((acc, competitor) => ({
    ...acc,
    [competitor._id]: [],
  }), {} as AggregateRoundResults<Id<'tournamentCompetitors'>>);
  const playerResults = includePlayerResults ? competitors.reduce((acc, competitor) => ({
    ...acc,
    ...competitor.players.reduce((playerAcc, player) => ({
      ...playerAcc,
      [player.userId]: [],
    })),
  }), {} as AggregateRoundResults<Id<'users'>>) : {};

  for (const pairing of relevantPairings) {
    const { _id: pairingId, round, tournamentCompetitor0Id, tournamentCompetitor1Id } = pairing;
    const matchResults = await getMatchResultsByTournamentPairing(ctx, pairingId);

    // [tournamentCompetitor0Id, tournamentCompetitor1Id].forEach((competitorId) => {
    //   // If a competitor ID is missing (because for example this pairing was a bye), ignore it
    //   if (!competitorId) {
    //     return;
    //   }
    //   if (!competitorResults[competitorId]) {
    //     competitorResults[competitorId] = [];
    //   }
    //   getCompetitorPLayerUserIds(competitorId, competitors).map((playerUserId) => {
    //     if (!playerResults[playerUserId]) {
    //       playerResults[playerUserId] = [];
    //     }
    //   });
    // });

    matchResults.forEach((matchResult) => {
      const { player0UserId, player1UserId, details } = matchResult;
      const score = calculateMatchScore(matchResult);

      [player0UserId, player1UserId].forEach((userId, i) => {
        if (!userId) {
          return;
        }

        // 1. Identify which competitor this player was playing for
        const competitorId = getPlayerCompetitorId(userId, competitors);
        if (!competitorId) {
          return;
        }

        // 2. Identify opponent IDs (competitor and player)
        const opponentCompetitorId = [
          tournamentCompetitor0Id,
          tournamentCompetitor1Id,
        ].filter((opponentId) => opponentId !== competitorId).pop() ?? null;
        const opponentUserId = i === 0 ? (player1UserId ?? null) : (player0UserId ?? null);

        // 2. Calculate their performance
        const baseResult: ResultData = {
          wins: details.winner === i ? 1 : 0,
          points: score[i],
          unitsDestroyed: i === 0 ? details.player1UnitsLost : details.player0UnitsLost,
          unitsLost: i === 0 ? details.player0UnitsLost : details.player1UnitsLost,
        };

        // 3. Add their performance to their competitor's results
        // if (!competitorResults[competitorId]) {
        //   competitorResults[competitorId] = [];
        // }
        competitorResults[competitorId].push({
          ...baseResult,
          opponentId: opponentCompetitorId,
          table: pairing.table,
          round,
        });

        // 4. Add their performance to their own results
        if (includePlayerResults) {
          // if (!playerResults[userId]) {
          //   playerResults[userId] = [];
          // }
          playerResults[userId].push({
            ...baseResult,
            opponentId: opponentUserId,
            table: pairing.table,
            round,
          });
        }
      });
    });
  }

  return {
    competitors: competitorResults,
    players: playerResults,
  };
};
