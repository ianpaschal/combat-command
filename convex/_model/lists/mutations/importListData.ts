import { GameSystem } from '@ianpaschal/combat-command-static-data/common';
import { ForceDiagram, Unit } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { Infer, v } from 'convex/values';
import { customAlphabet } from 'nanoid';

import { MutationCtx } from '../../../_generated/server';
import { getStaticEnumConvexValidator } from '../../common/_helpers/getStaticEnumConvexValidator';

const forceDiagram = getStaticEnumConvexValidator(ForceDiagram);
const formation = getStaticEnumConvexValidator(Unit);

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

export const importListDataArgs = v.object({
  pointsLimit: v.number(),
  data: v.array(v.object({
    playerUserId: v.id('users'),
    tournamentCompetitorId: v.id('tournamentCompetitors'),
    forceDiagram,
    formations: v.array(formation),
  })),
});

export const importListData = async (
  ctx: MutationCtx,
  args: Infer<typeof importListDataArgs>,
): Promise<void> => {
  for (const row of args.data) {
    const listId = await ctx.db.insert('lists', {
      gameSystem: GameSystem.FlamesOfWarV4, 
      ownerUserId: row.playerUserId,
      data: {
        meta: {
          forceDiagram: row.forceDiagram,
          pointsLimit: args.pointsLimit,
        },
        formations: row.formations.map((sourceId) => ({
          id: nanoid(),
          sourceId,
        })),
        units: [],
        commandCards: [],
      },
    });
    const competitor = await ctx.db.get(row.tournamentCompetitorId);
    if (competitor) {
      await ctx.db.patch(row.tournamentCompetitorId, {
        players: competitor.players.map((p) => (
          p.userId === row.playerUserId ? { ...p, listId } : p
        )),
      });
    }
  }
};
