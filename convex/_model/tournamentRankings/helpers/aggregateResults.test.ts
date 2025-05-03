import { convexTest } from 'convex-test';
import {
  describe,
  expect,
  it,
} from 'vitest';

import { createFakeUserData } from '../../../_fixtures/createFakeUserData';
import { defaultTeamTournament } from '../../../_fixtures/defaultTeamTournament';
import { api } from '../../../_generated/api';
import { Id } from '../../../_generated/dataModel';
import schema from '../../../schema';

describe('aggregateResults', async () => {
  const t = convexTest(schema);
  let tournamentId: Id<'tournaments'>;
  await t.run(async (ctx) => {
    const { maxCompetitors, competitorSize } = defaultTeamTournament;
    // const rounds = 2;
    
    // Create users
    const userIds: Id<'users'>[] = [];
    for (let i = 0; i < (maxCompetitors * competitorSize) + 1; i++) {
      const id = await ctx.db.insert('users', createFakeUserData());
      userIds.push(id);
    }

    // Create tournament
    const organizerId = userIds.pop();
    if (!organizerId) {
      throw new Error('User ID array is empty, something went wrong with generating users!');
    }
    tournamentId = await ctx.db.insert('tournaments', {
      ...defaultTeamTournament,
      organizerUserIds: [organizerId],
      status: 'active',
    });

    // Create tournament competitors
    const tournamentCompetitorIds: Id<'tournamentCompetitors'>[] = [];
    for (let i = 0; i < maxCompetitors; i++) {
      const startingIndex = i * competitorSize;
      const endingIndex = i * competitorSize + competitorSize;
      const playerUserIds = userIds.slice(startingIndex, endingIndex);
      const id = await ctx.db.insert('tournamentCompetitors', {
        tournamentId,
        teamName: `Team ${i + 1}`,
        players: playerUserIds.map((userId) => ({ userId, active: true })),
      });
      tournamentCompetitorIds.push(id);
    }

    // Create pairings
    // for (let i = 0; i < rounds; i++) {
    //   for (let ii = 0; i < maxCompetitors / 2; ii++) {
    //     const competitorIds = tournamentCompetitorIds.slice(ii * competitorSize + i, ii * competitorSize + i + 2);
    //     await ctx.db.insert('tournamentPairings', {
    //       tournamentId,
    //       tournamentCompetitor0Id: competitorIds[0],
    //       tournamentCompetitor1Id: competitorIds[1] || tournamentCompetitorIds[0],
    //       table: ii,
    //       round: i,
    //     });
    //   }
    // }
    // const pairings = await ctx.db.query('tournamentPairings').collect();
    // console.log(pairings);

    // Create match results
  });

  it.skip('should aggregate results for each competitor in the tournament', async () => {
    const tournamentRankings = await t.query(api.tournamentRankings.getTournamentRankings, {
      tournamentId,
      round: 0,
    });
    expect(tournamentRankings).toMatchObject([
      { body: 'Hi!', author: 'Sarah' },
      { body: 'Hey!', author: 'Tom' },
    ]);
  });

  it.skip('should aggregate results for each player in the tournament if enabled', async () => {
    // await t.mutation(api.messages.send, { body: 'Hi!', author: 'Sarah' });
    // await t.mutation(api.messages.send, { body: 'Hey!', author: 'Tom' });
    // const messages = await t.query(api.messages.list);
    // expect(messages).toMatchObject([
    //   { body: 'Hi!', author: 'Sarah' },
    //   { body: 'Hey!', author: 'Tom' },
    // ]);
  });

  it.skip('should throw an error if a pairing is missing a competitor', async () => {
    // await t.mutation(api.messages.send, { body: 'Hi!', author: 'Sarah' });
    // await t.mutation(api.messages.send, { body: 'Hey!', author: 'Tom' });
    // const messages = await t.query(api.messages.list);
    // expect(messages).toMatchObject([
    //   { body: 'Hi!', author: 'Sarah' },
    //   { body: 'Hey!', author: 'Tom' },
    // ]);
  });

  it.skip('should throw an error if a match result is missing a competitor', async () => {
    // await t.mutation(api.messages.send, { body: 'Hi!', author: 'Sarah' });
    // await t.mutation(api.messages.send, { body: 'Hey!', author: 'Tom' });
    // const messages = await t.query(api.messages.list);
    // expect(messages).toMatchObject([
    //   { body: 'Hi!', author: 'Sarah' },
    //   { body: 'Hey!', author: 'Tom' },
    // ]);
  });
});
