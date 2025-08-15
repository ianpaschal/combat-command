import { factions, forceDiagrams } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { Doc } from '../../_generated/dataModel';

export type FowV4ListData = Doc<'lists'>['data'];

export type DeepFowV4ListData = ReturnType<typeof deepenFowV4ListData>;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenFowV4ListData = (
  data: FowV4ListData,
) => ({
  ...data,
  meta: {
    ...data.meta,
    faction: forceDiagrams[data.meta.forceDiagram].faction,
    alignment: factions[forceDiagrams[data.meta.forceDiagram].faction].alignment,
  },
});
