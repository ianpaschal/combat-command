/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissionName } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { Doc } from '../../../_generated/dataModel';
import { Statistic, WLD } from './types';

type Role = 'attacker' | 'defender' | 'firstTurn' | 'secondTurn';

export const getMissionVsRoleTurnStats = async (
  matchResults: Doc<'matchResults'>,
): Promise<Statistic<[MissionName, Role], WLD>[]> => {

  const foo = 'bar';

  return [];
};
