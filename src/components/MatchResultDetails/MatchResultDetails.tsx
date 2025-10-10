import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { MatchResult } from '~/api';
import { GameSystemTypeGuard } from '~/components/GameSystemTypeGuard';
import { useElementSize } from '~/hooks/useElementSize';
import { FlamesOfWarV4MatchResultDetails } from './gameSystems/FlamesOfWarV4MatchResultDetails';
import { TeamYankeeV2MatchResultDetails } from './gameSystems/TeamYankeeV2MatchResultDetails';

export interface MatchResultDetailsProps {
  className?: string;
  details?: MatchResult['details'];
  gameSystem: GameSystem;
  playerNames: [string, string];
  score: [number, number];
}

export const MatchResultDetails = ({
  className,
  details,
  playerNames,
  gameSystem,
}: MatchResultDetailsProps): JSX.Element => {
  const [ref, width] = useElementSize();
  const orientation: 'horizontal' | 'vertical' = Math.ceil(width) < 654 ? 'vertical' : 'horizontal'; // 2 x 320 + 1rem - 2x border
  if (!details) {
    return (
      <div className={className} ref={ref}>
        <p>
          Tournament match result details are hidden until the tournament is finished.
        </p>
      </div>
    );
  }

  const sharedProps = {
    className,
    orientation,
    playerNames,
  };

  if (gameSystem === GameSystem.FlamesOfWarV4) {
    return (
      <GameSystemTypeGuard.FlamesOfWarV4
        details={details}
        render={(props) => (
          <FlamesOfWarV4MatchResultDetails ref={ref} {...sharedProps} {...props} />
        )}
      />
    );
  }

  if (gameSystem === GameSystem.TeamYankeeV2) {
    return (
      <GameSystemTypeGuard.TeamYankeeV2
        details={details}
        render={(props) => (
          <TeamYankeeV2MatchResultDetails ref={ref} {...sharedProps} {...props} />
        )}
      />
    );
  }

  throw new Error(`Could not find <MatchResultDetails/> for game system ${gameSystem}`);
};
