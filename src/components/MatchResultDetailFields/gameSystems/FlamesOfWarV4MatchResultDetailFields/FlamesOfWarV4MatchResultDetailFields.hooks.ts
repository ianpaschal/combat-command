import { useMemo } from 'react';
import {
  BattlePlan,
  calculateMatchResultAttacker,
  calculateMatchResultFirstTurn,
  calculateMatchResultWinner,
  GameSystemConfig,
  getMission,
  getMissionOptions,
  getMissionOutcomeOptions,
  MatchResultDetails as FlamesOfWarV4MatchResultDetails,
  MissionName,
} from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';

import { MatchResultDetails } from '~/components/MatchResultDetailFields/MatchResultDetailFields.schema';

export const useMissionOptions = (
  gameSystemConfig: GameSystemConfig | null,
  player0BattlePlan?: BattlePlan,
  player1BattlePlan?: BattlePlan,
) => useMemo(() => {
  const isPlayer0BattlePlanValid = player0BattlePlan && Object.values(BattlePlan).includes(player0BattlePlan);
  const isPlayer1BattlePlanValid = player1BattlePlan && Object.values(BattlePlan).includes(player1BattlePlan);
  if (gameSystemConfig && isPlayer0BattlePlanValid && isPlayer1BattlePlanValid) {
    const { missionPackVersion, missionMatrix } = gameSystemConfig;
    return getMissionOptions(missionPackVersion, missionMatrix, [
      player0BattlePlan,
      player1BattlePlan,
    ]);
  }
  return [];
}, [gameSystemConfig, player0BattlePlan, player1BattlePlan]);

export const useOutcomeTypeOptions = (
  gameSystemConfig: GameSystemConfig | null,
  mission?: MissionName,
) => useMemo(() => {
  const isMissionValid = mission && Object.values(MissionName).includes(mission);
  if (gameSystemConfig && isMissionValid) {
    const { missionPackVersion } = gameSystemConfig;
    return getMissionOutcomeOptions(missionPackVersion, mission);
  }
  return [];
}, [gameSystemConfig, mission]);

export const computeFields = (
  gameSystemConfig: GameSystemConfig | null,
  details: Partial<MatchResultDetails>,
): Partial<FlamesOfWarV4MatchResultDetails> | null => {
  const computedDetails: Partial<FlamesOfWarV4MatchResultDetails> = {};

  if (!gameSystemConfig) {
    return null;
  }
  
  const missionData = getMission(gameSystemConfig.missionPackVersion, details.mission);

  const attacker = calculateMatchResultAttacker(missionData, [
    details.player0BattlePlan,
    details.player1BattlePlan,
  ]);
  if (attacker !== undefined) {
    computedDetails.attacker = attacker;
  }

  const firstTurn = calculateMatchResultFirstTurn(missionData, attacker ?? details.attacker);
  if (firstTurn !== undefined) {
    computedDetails.firstTurn = firstTurn;
  }

  const winner = calculateMatchResultWinner(missionData, attacker ?? details.attacker, details.outcomeType, details.scoreOverride);
  if (winner !== undefined) {
    computedDetails.winner = winner;
  }

  return computedDetails;
};
