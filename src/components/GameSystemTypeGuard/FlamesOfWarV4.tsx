import { ReactElement, useMemo } from 'react';
import {
  GameSystemConfig as FlamesOfWarV4GameSystemConfig,
  gameSystemConfig as flamesOfWarV4GameSystemConfig,
  MatchResultDetails as FlamesOfWarV4MatchResultDetails,
  matchResultDetails as flamesOfWarV4MatchResultDetails,
} from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';

import { GameSystemConfig } from '~/components/GameSystemConfigFields';
import { MatchResultDetails } from '~/components/MatchResultDetailFields';
import { Input, Output } from './types';

type FlamesOfWarV4Props<
  TGameSystemConfig extends Input<GameSystemConfig> = undefined,
  TDetails extends Input<MatchResultDetails> = undefined
> = {
  gameSystemConfig?: TGameSystemConfig;
  details?: TDetails;
  render: (props: {
    gameSystemConfig: Output<GameSystemConfig, FlamesOfWarV4GameSystemConfig, TGameSystemConfig>;
    details: Output<MatchResultDetails, FlamesOfWarV4MatchResultDetails, TDetails>;
  }) => ReactElement;
};

export const FlamesOfWarV4 = <
  TGameSystemConfig extends Input<GameSystemConfig> = undefined,
  TDetails extends Input<MatchResultDetails> = undefined
>({
  gameSystemConfig,
  details,
  render,
}: FlamesOfWarV4Props<TGameSystemConfig, TDetails>): JSX.Element | null => {

  // Check game system config, if present:
  const isGameSystemConfigValid = useMemo(() => {
    if (gameSystemConfig) {
      return flamesOfWarV4GameSystemConfig.schema.safeParse(gameSystemConfig).success;
    }
    return true; // If there was no game system config provided, we consider undefined to be OK
  }, [gameSystemConfig]);

  // Check match result details, if present:
  const isMatchResultDetailsValid = useMemo(() => {
    if (details) {
      return flamesOfWarV4MatchResultDetails.schema.safeParse(details).success;
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
    gameSystemConfig: gameSystemConfig as Output<GameSystemConfig, FlamesOfWarV4GameSystemConfig, TGameSystemConfig>,
    details: details as Output<MatchResultDetails, FlamesOfWarV4MatchResultDetails, TDetails>,
  });
};
