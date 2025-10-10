import { GameSystemConfig, getEraDisplayName } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { Weight } from 'lucide-react';

export interface FlamesOfWarV4InfoLineProps {
  gameSystemConfig: GameSystemConfig
}

export const FlamesOfWarV4InfoLine = ({
  gameSystemConfig,
}: FlamesOfWarV4InfoLineProps): JSX.Element => (
  <>
    <Weight />
    <span>{`${gameSystemConfig.points} pts`}</span>
    <span>{getEraDisplayName(gameSystemConfig.era)}</span>
  </>
);
