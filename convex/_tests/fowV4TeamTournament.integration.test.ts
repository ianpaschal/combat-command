import { convexTest } from 'convex-test';
import {
  describe,
  expect,
  test,
} from 'vitest';

import { createFakeMatchResultData } from '../_fixtures/createFakeMatchResultData';
import { createFakeUserData } from '../_fixtures/createFakeUserData';
import { defaultTeamTournament } from '../_fixtures/defaultTeamTournament';
import { api } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import { generateDraftAdjacentPairings } from '../_model/tournamentPairings/actions/generateDraftAdjacentPairings';
import { generateDraftRandomPairings } from '../_model/tournamentPairings/actions/generateDraftRandomPairings';
import schema from '../schema';

describe('Integration: Flames of War V4 Team Tournament', async () => {
  const rounds = 6;
  const t = convexTest(schema);
  const { maxCompetitors, competitorSize } = defaultTeamTournament;
  const pairingsPerRound = maxCompetitors / 2;
  const asUser = (id: string) => t.withIdentity({ _id: id, subject: id });

  // For use between tests
  let tournamentId: Id<'tournaments'>;
  const userIds: Id<'users'>[] = [];
  const tournamentCompetitorIds: Id<'tournamentCompetitors'>[] = [];

  // Create users
  await t.run(async (ctx) => {
    for (let i = 0; i < (maxCompetitors * competitorSize) + 1; i++) {
      const id = await ctx.db.insert('users', createFakeUserData());
      userIds.push(id);
    }
  });

  const organizerId = userIds.pop();
  if (!organizerId) {
    throw 'No user ID for organizer: Something went wrong with user mocking!';
  }
    
  test('The TO can create the tournament.', async () => {
    tournamentId = await t.mutation(api.tournaments.createTournament, {
      ...defaultTeamTournament,
      organizerUserIds: [organizerId],
    });
  });
  
  test('The TO can publish the tournament.', async () => {
    await t.mutation(api.tournaments.publishTournament, {
      id: tournamentId,
    });
    const tournament = await t.query(api.tournaments.getTournament, {
      id: tournamentId,
    });
    expect(tournament?.status).toBe('published');
  });

  test('Users can register for the tournament.', async () => {
    // Act
    for (let i = 0; i < maxCompetitors; i++) {

      // Create team and Add first player and create team
      const firstPlayerUserIndex = i * competitorSize;
      const firstPlayerUserId = userIds[firstPlayerUserIndex];
      const tournamentCompetitorId = await asUser(firstPlayerUserId).mutation(api.tournamentCompetitors.createTournamentCompetitor, {
        teamName: `Team ${i + 1}`,
        players: [{ userId: userIds[firstPlayerUserIndex], active: false }],
        tournamentId,
      });
      tournamentCompetitorIds.push(tournamentCompetitorId);

      // Add additional players
      for (let j = 1; j < competitorSize; j++) {
        const userId = userIds[firstPlayerUserIndex+j];
        await asUser(userId).mutation(api.tournamentCompetitors.addPlayerToTournamentCompetitor, {
          tournamentCompetitorId,
          playerUserId: userId,
        });
      }    
    }

    // Assert
    const tournamentCompetitors = await t.query(api.tournamentCompetitors.getTournamentCompetitorListByTournamentId, {
      tournamentId,
    });
    expect(tournamentCompetitors.length).toEqual(maxCompetitors);
  });

  test('The TO can generate round 0 (random) pairings.', async () => {

    // Create Draft pairings
    const { pairings: draftPairings } = generateDraftRandomPairings(tournamentCompetitorIds.map((id, i) => ({
      id,
      opponentIds: [],
      rank: i,
    })));
    expect(draftPairings.length).toEqual(tournamentCompetitorIds.length / 2);

    // Submit draft pairings
    await asUser(organizerId).mutation(api.tournamentPairings.createTournamentPairings, {
      tournamentId,
      round: 0,
      pairings: draftPairings.map((pairing, i) => ({
        tournamentCompetitor0Id: pairing[0].id,
        tournamentCompetitor1Id: pairing[1].id,
        table: i,
      })),
    });

    // Validate
    // Validate
    const pairings = await t.query(api.tournamentPairings.getTournamentPairingList, {
      tournamentId,
      round: 0,
    });
    expect(pairings.length).toEqual(pairingsPerRound);
  });

  // TODO: Test Check-In behavior
  test('The TO can check in all players.', async () => {
    const tournamentCompetitors = await t.run(async (ctx) => await ctx.db.query('tournamentCompetitors').collect());
    for (const competitor of tournamentCompetitors) {
      const playerUserIds = competitor.players.map((player) => player.userId);
      for (const playerUserId of playerUserIds) {
        await asUser(organizerId).mutation(api.tournaments.checkInPlayer, {
          tournamentCompetitorId: competitor._id,
          playerUserId,
        });
      }
    }

    // Validate
    t.run(async (ctx) => {
      const tournamentCompetitors = await ctx.db.query('tournamentCompetitors').collect();
      const activePlayerUserIds = tournamentCompetitors.reduce((acc, competitor) => [
        ...acc,
        ...competitor.players.filter((player) => player.active).map((player) => player.userId),
      ], [] as Id<'users'>[]);
      expect(activePlayerUserIds.length).toEqual(maxCompetitors * competitorSize);
    });
  });

  test('The TO can start round 1.', async () => {
    await asUser(organizerId).mutation(api.tournaments.startTournament, { id: tournamentId });

    t.run(async (ctx) => {
      const tournament = await ctx.db.get(tournamentId);
      expect(tournament?.currentRound).toEqual(0);
      expect(tournament?.status).toBe('active');
    });
  });

  for (let i = 0; i < rounds; i++) {
    // test(`The TO can start round ${i + 2}.`, async () => {

    // });
    test(`Users can submit their round ${i} match results.`, async () => {
      const pairings = await t.query(api.tournamentPairings.getTournamentPairingList, {
        tournamentId,
        round: i,
      });

      // For each pairing, submit a match result for each active player
      for (const pairing of pairings) {
        const competitor0ActivePlayers = pairing.tournamentCompetitor0.players.filter((player) => player.active);
        const competitor1ActivePlayers = pairing.tournamentCompetitor1.players.filter((player) => player.active);
        for (const [i, player] of competitor0ActivePlayers.entries()) {
          const player0UserId = player.user?._id;
          const player1UserId = competitor1ActivePlayers[i].user?._id;
          if (player0UserId && player1UserId) {
            await asUser(player0UserId).mutation(api.matchResults.mutations.createMatchResult, createFakeMatchResultData({
              tournamentPairingId: pairing._id,
              player0UserId,
              player1UserId,
            }));
          }
        }
      }

      const matchResults = await t.run(async (ctx) => await ctx.db.query('matchResults').collect());
      expect(matchResults.length).toEqual((maxCompetitors * competitorSize / 2) * (i + 1));
    });

    // FIXME: Is this needed? Doesn't it end anyway with the timer? Match submission can stay open and close automatically when required number are submitted
    // test(`The TO can end round ${i}.`, async () => {

    //   // TODO: Check that match result length to be correct
    // });

    // TODO: Move to unit tests
    // test.skip(`The TO can NOT generate round ${i + 1} rankings without enough matches.`, async () => {
    
    // });

    test(`The TO can generate round ${i} rankings.`, async () => {
      // Only if required number of matches submitted
      const { competitors } = await t.query(api.tournamentRankings.getTournamentRankings, {
        tournamentId,
        round: i,
        includePlayers: false,
      });

      // console.log(competitors);
      expect(competitors.length).toEqual(tournamentCompetitorIds.length);
      expect(competitors[0].opponentIds.length).toEqual(i + 1);

      // console.log(competitors);
    });

    // TODO: Move to unit tests
    // test.skip(`The TO can NOT generate round ${i + 1} pairings for competitors missing players.`, async () => {
    
    // });

    test(`The TO can generate round ${i + 1} pairings.`, async () => {
      const nextRound = i + 1;
      const { competitors } = await t.query(api.tournamentRankings.getTournamentRankings, {
        tournamentId,
        round: i,
        includePlayers: false,
      });
      
      // Create Draft pairings
      const { pairings: draftPairings, unpairedCompetitors } = generateDraftAdjacentPairings(competitors.map((competitor, competitorIndex) => ({
        ...competitor,
        rank: competitorIndex,
      })));

      // console.log('round', i, draftPairings, unpairedCompetitors);

      expect(draftPairings.length).toEqual(pairingsPerRound);
      expect(unpairedCompetitors.length).toEqual(0);

      // console.log('draft pairings', nextRound, draftPairings, unpairedCompetitors);

      // Submit draft pairings
      await asUser(organizerId).mutation(api.tournamentPairings.createTournamentPairings, {
        tournamentId,
        round: nextRound,
        pairings: draftPairings.map((pairing, tableIndex) => ({
          tournamentCompetitor0Id: pairing[0].id,
          tournamentCompetitor1Id: pairing[1].id,
          table: tableIndex,
        })),
      });

      // Validate
      const pairings = await t.query(api.tournamentPairings.getTournamentPairingList, {
        tournamentId,
        round: nextRound,
      });
      expect(pairings.length).toEqual(pairingsPerRound);
    });
  }
});
