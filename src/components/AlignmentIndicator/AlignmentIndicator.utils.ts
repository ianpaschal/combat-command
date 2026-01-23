import { Alignment as FlamesOfWarV4 } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { Alignment as TeamYankeeV2 } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';

import { Alignment } from '~/api';

export const getAlignmentColor = (
  alignment: Alignment,
): 'red' | 'blue' | 'mixed' => {
  if (alignment === FlamesOfWarV4.Allies) {
    return 'blue';
  }
  if (alignment === FlamesOfWarV4.Axis) {
    return 'red';
  }
  if (alignment === TeamYankeeV2.Nato) {
    return 'blue';
  }
  if (alignment === TeamYankeeV2.WarsawPact) {
    return 'red';
  }
  return 'mixed';
};
