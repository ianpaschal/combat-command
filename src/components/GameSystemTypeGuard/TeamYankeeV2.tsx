import { ReactElement, useMemo } from 'react';
import {
  GameSystemConfig as TeamYankeeV2GameSystemConfig,
  gameSystemConfig as teamYankeeV2GameSystemConfig,
  MatchResultDetails as TeamYankeeV2MatchResultDetails,
  matchResultDetails as teamYankeeV2MatchResultDetails,
} from '@ianpaschal/combat-command-game-systems/teamYankeeV2';

import { GameSystemConfig } from '~/components/GameSystemConfigFields';
import { MatchResultDetails } from '~/components/MatchResultDetailFields';
import { Input, Output } from './types';

type TeamYankeeV2Props<
  TGameSystemConfig extends Input<GameSystemConfig> = undefined,
  TDetails extends Input<MatchResultDetails> = undefined
> = {
  gameSystemConfig?: TGameSystemConfig;
  details?: TDetails;
  render: (props: {
    gameSystemConfig: Output<GameSystemConfig, TeamYankeeV2GameSystemConfig, TGameSystemConfig>;
    details: Output<MatchResultDetails, TeamYankeeV2MatchResultDetails, TDetails>;
  }) => ReactElement;
};

export const TeamYankeeV2 = <
  TGameSystemConfig extends Input<GameSystemConfig> = undefined,
  TDetails extends Input<MatchResultDetails> = undefined
>({
  gameSystemConfig,
  details,
  render,
}: TeamYankeeV2Props<TGameSystemConfig, TDetails>): JSX.Element | null => {

  // Check game system config, if present:
  const isGameSystemConfigValid = useMemo(() => {
    if (gameSystemConfig) {
      return teamYankeeV2GameSystemConfig.schema.safeParse(gameSystemConfig).success;
    }
    return true; // If there was no game system config provided, we consider undefined to be OK
  }, [gameSystemConfig]);

  // Check match result details, if present:
  const isMatchResultDetailsValid = useMemo(() => {
    if (details) {
      return teamYankeeV2MatchResultDetails.schema.safeParse(details).success;
    }
    return true; // If there were no details provided, we consider undefined to be OK
  }, [details]);

  if (gameSystemConfig && !isGameSystemConfigValid) {
    return null;
  }

  if (details && !isMatchResultDetailsValid) {
    return null;
  }

  return render({
    gameSystemConfig: gameSystemConfig as Output<GameSystemConfig, TeamYankeeV2GameSystemConfig, TGameSystemConfig>,
    details: details as Output<MatchResultDetails, TeamYankeeV2MatchResultDetails, TDetails>,
  });
};
