import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { GameSystemConfig } from '~/components/GameSystemConfigFields';
import { MatchResultDetails } from './MatchResultDetailFields.schema';

export type CompatibleFormData = {
  gameSystem: GameSystem;
  gameSystemConfig: GameSystemConfig
  details: MatchResultDetails;
};
