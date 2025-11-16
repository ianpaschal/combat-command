import { factions, forceDiagrams } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';

import { Doc } from '../../../../../../_generated/dataModel';

export type DeepFowV4ListData = ReturnType<typeof deepenListData>;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenListData = (
  data: Doc<'lists'>['data'],
) => ({
  ...data,
  meta: {
    ...data.meta,
    faction: forceDiagrams[data.meta.forceDiagram].faction,
    alignment: factions[forceDiagrams[data.meta.forceDiagram].faction].alignment,
  },
});
