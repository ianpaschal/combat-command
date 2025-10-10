import { GameSystemConfig } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { Weight } from 'lucide-react';

export interface TeamYankeeV2InfoLineProps {
  gameSystemConfig: GameSystemConfig
}

export const TeamYankeeV2InfoLine = ({
  gameSystemConfig,
}: TeamYankeeV2InfoLineProps): JSX.Element => (
  <>
    <Weight />
    <span>{`${gameSystemConfig.points} pts`}</span>
  </>
);
