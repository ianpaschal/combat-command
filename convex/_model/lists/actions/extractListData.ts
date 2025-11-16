/* eslint-disable @typescript-eslint/no-unused-vars */
import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { ForceDiagram, Unit } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { Infer, v } from 'convex/values';
import { customAlphabet } from 'nanoid';

import { ActionCtx, MutationCtx } from '../../../_generated/server';
import { getStaticEnumConvexValidator } from '../../common/_helpers/getStaticEnumConvexValidator';

const forceDiagram = getStaticEnumConvexValidator(ForceDiagram);
const formation = getStaticEnumConvexValidator(Unit);

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

export const extractListDataArgs = v.object({
  storageId: v.id('_storage'),
  gameSystem: v.string(),
});

export const extractListData = async (
  ctx: ActionCtx,
  args: Infer<typeof extractListDataArgs>,
): Promise<{ fileType: string; data: Record<string, string> }> => 

  // const fileMetadata = ctx.runQuery();
  ({
    fileType: 'foo',
    data: {
      foo: 'foo',
    },
  })
;

//   gameSystem: GameSystem.FlamesOfWarV4,
//   tournamentRegistrationId: 
//   // ownerUserId: row.playerUserId,
//   // data: {
//   //   meta: {
//   //     forceDiagram: row.forceDiagram,
//   //     pointsLimit: args.pointsLimit,
//   //   },
//   //   formations: row.formations.map((sourceId) => ({
//   //     id: nanoid(),
//   //     sourceId,
//   //   })),
//   //   units: [],
//   //   commandCards: [],
//   // },
//   // locked: args.locked,
