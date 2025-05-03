import { convexTest } from 'convex-test';
import {
  describe,
  expect,
  it,
} from 'vitest';

import { api } from '../../_generated/api';
import { Id } from '../../_generated/dataModel';
import schema from '../../schema';

describe('getTournamentRankings', () => {
  const t = convexTest(schema);

  it('should throw an error if tournament is not found', async () => {
    await expect(async () => {
      await t.query(api.tournamentRankings.getTournamentRankings, { 
        tournamentId: 'not_a_valid_id' as Id<'tournaments'>,
        round: 1,
        includePlayers: true,
      });
    }).rejects.toThrowError();
  });

  // it('should return sorted competitors and players', async () => {
  //   const tournament = {
  //     rankingFactors: ['total', 'average'],
  //     competitorSize: 10,
  //   };
  //   const rawResults = {
  //     competitors: { competitor1: { total: 100, average: 10 }, competitor2: { total: 90, average: 9 } },
  //     players: { player1: { total: 80, average: 8 }, player2: { total: 70, average: 7 } },
  //   };
  //   const extendedResults = {
  //     competitors: { competitor1: { total: 100, average: 10 }, competitor2: { total: 90, average: 9 } },
  //     players: { player1: { total: 80, average: 8 }, player2: { total: 70, average: 7 } },
  //   };

  //   (getTournament as vi.Mock).mockResolvedValue(tournament);
  //   (aggregateResults as vi.Mock).mockResolvedValue(rawResults);
  //   (extendResults as vi.Mock).mockReturnValue(extendedResults);
  //   (compareResults as vi.Mock).mockImplementation((a, b, factors) => a[factors[0]] - b[factors[0]]);

  //   const result = await getTournamentRankings(ctx, validArgs);

  //   expect(result).toEqual({
  //     competitors: [
  //       { id: 'competitor1', total: 100, average: 10 },
  //       { id: 'competitor2', total: 90, average: 9 },
  //     ],
  //     players: [
  //       { id: 'player1', total: 80, average: 8 },
  //       { id: 'player2', total: 70, average: 7 },
  //     ],
  //   });
  // });

  // it('should return only sorted competitors when includePlayers is false', async () => {
  //   const tournament = {
  //     rankingFactors: ['total', 'average'],
  //     competitorSize: 10,
  //   };
  //   const rawResults = {
  //     competitors: { competitor1: { total: 100, average: 10 }, competitor2: { total: 90, average: 9 } },
  //     players: undefined,
  //   };
  //   const extendedResults = {
  //     competitors: { competitor1: { total: 100, average: 10 }, competitor2: { total: 90, average: 9 } },
  //     players: undefined,
  //   };

  //   (getTournament as vi.Mock).mockResolvedValue(tournament);
  //   (aggregateResults as vi.Mock).mockResolvedValue(rawResults);
  //   (extendResults as vi.Mock).mockReturnValue(extendedResults);
  //   (compareResults as vi.Mock).mockImplementation((a, b, factors) => a[factors[0]] - b[factors[0]]);

  //   const result = await getTournamentRankings(ctx, { id, round, includePlayers: false });

  //   expect(result).toEqual({
  //     competitors: [
  //       { id: 'competitor1', total: 100, average: 10 },
  //       { id: 'competitor2', total: 90, average: 9 },
  //     ],
  //     players: undefined,
  //   });
  // });
});
