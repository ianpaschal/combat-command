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
    displayName: v.optional(v.string()), // Not used, but allowed because its handy in the raw data.
    forceDiagram,
    formations: v.array(formation),
    playerUserId: v.id('users'),
    tournamentRegistrationId: v.id('tournamentRegistrations'),
  })),
  locked: v.boolean(),
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
      locked: args.locked,
    });

    await ctx.db.patch(row.tournamentRegistrationId, { listId });
  }
};
