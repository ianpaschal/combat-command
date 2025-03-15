import { useFormContext } from 'react-hook-form';
import { useQuery } from 'convex/react';

import {
  api,
  FowV4MatchOutcomeType,
  getMission,
  getMissionPack,
  UserId,
} from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

export const usePlayerDisplayName = ({ userId, placeholder }: { userId?: UserId, placeholder?: string }): string => {
  const currentUser = useAuth();
  const user = useQuery(api.users.fetchUser.fetchUser, userId ? { id: userId } : 'skip');
  if (!userId && placeholder) {
    return placeholder;
  }
  if (userId && !placeholder) {
    if (user?._id === currentUser?._id) {
      return 'You';
    }
    return getUserDisplayNameString(user);
  }
  return 'Unknown Player';
};

export const usePlayerOptions = (): { value: number, label: string }[] => {
  const { watch } = useFormContext();
  const {
    player0UserId,
    player1UserId,
    player0Placeholder,
    player1Placeholder,
  } = watch();
  const playerNames = [
    usePlayerDisplayName({ userId: player0UserId, placeholder: player0Placeholder }),
    usePlayerDisplayName({ userId: player1UserId, placeholder: player1Placeholder }),
  ];
  return playerNames.map((label, value) => ({ label, value })); // Will be coerced back to number by Zod
};

import { useMemo } from 'react';

export const useMissionOptions = () => {
  const { watch } = useFormContext();
  const { details, gameSystemConfig } = watch();
  const {
    player0BattlePlan,
    player1BattlePlan,
  } = details;
  const {
    missionMatrixId,
    missionPackId,
    useExperimentalMissions,
  } = gameSystemConfig;
  return useMemo(() => {
    const missionPack = getMissionPack(missionPackId);
    const missionsOptions = (missionPack?.missions || []).map((mission) => ({
      label: mission.displayName,
      value: mission.id,
    }));
    const activeMatrix = missionPack?.matrixes.find((matrix) => matrix.id === missionMatrixId);
        
    if (!player0BattlePlan || !player1BattlePlan || !missionMatrixId ) {
      return missionsOptions;
    }
    
    if (!activeMatrix) {
      throw Error('Could not find a mission matrix with that ID!');
    }
    
    const matrixEntry = activeMatrix.entries.find(({ battlePlans }) => (
      (player0BattlePlan === battlePlans[0] && player1BattlePlan === battlePlans[1])
      || (player1BattlePlan === battlePlans[0] && player0BattlePlan === battlePlans[1])
    ))!;
    
    const matrixEntryMissionIds = matrixEntry.missions.reduce((acc: string[], item) => {
      if (Array.isArray(item)) {
        if (item[1] && useExperimentalMissions) {
          return [...acc, item[1]];
        }
        return [ ...acc, ...item];
      }
      return [ ...acc,item];
    }, []);
    return missionsOptions.filter((option) => matrixEntryMissionIds.includes(option.value));
  }, [player0BattlePlan, player1BattlePlan, missionPackId, missionMatrixId, useExperimentalMissions]);
};

export const useOutcomeTypeOptions = () => {
  const { watch } = useFormContext();
  const data = watch();
  const missionPack = getMissionPack(data.gameSystemConfig.missionPackId);
  const mission = missionPack ? getMission(data.details.missionId) : null;
  const options: { value: FowV4MatchOutcomeType, label: string }[] = [
    { label: 'Force Broken', value: 'force_broken' },
    { label: 'Time Out / Draw', value: 'time_out' },
  ];
  if (mission?.victoryConditions.includes('objective_taken')) {
    options.push({ label: 'Objective Captured', value: 'objective_taken' });
  }
  if (mission?.victoryConditions.includes('attack_repelled')) {
    options.push({ label: 'Attack Repelled', value: 'attack_repelled' });
  }
  return options;
};

export const computeAttacker = (missionId?: string, player0BattlePlan?: string, player1BattlePlan?: string): 0 | 1 | undefined => {
  if (!missionId || !player0BattlePlan || !player1BattlePlan) {
    return undefined;
  }
  const mission = getMission(missionId);
  if (!mission) {
    return undefined;
  }
  if (mission.attacker === 'roll' || player0BattlePlan === player1BattlePlan) {
    return undefined;
  }
  if (player0BattlePlan === 'attack' && player1BattlePlan === 'maneuver') {
    return 0;
  }
  if (player0BattlePlan === 'attack' && player1BattlePlan === 'defend') {
    return 0;
  }
  if (player0BattlePlan === 'maneuver' && player1BattlePlan === 'defend') {
    return 0;
  }
  if (player0BattlePlan === 'maneuver' && player1BattlePlan === 'attack') {
    return 1;
  }
  if (player0BattlePlan === 'defend' && player1BattlePlan === 'attack') {
    return 1;
  }
  if (player0BattlePlan === 'defend' && player1BattlePlan === 'maneuver') {
    return 1;
  }
};

export const computeFirstTurn = (missionId?: string, attacker?: 0 | 1): 0 | 1 | undefined => {
  if (!missionId || attacker === undefined) {
    return undefined;
  }
  const mission = getMission(missionId);
  if (!mission) {
    return undefined;
  }
  if (mission.firstTurn === 'roll') {
    return undefined;
  }
  if (mission.firstTurn === 'attacker') {
    return attacker;
  }
  if (mission.firstTurn === 'defender') {
    if (attacker === 0) {
      return 1;
    }
    return 0;
  }
};

export const computeWinner = (missionId?: string, attacker?: 0 | 1, outcomeType?: FowV4MatchOutcomeType): -1 | 0 | 1 | undefined => {
  if (!missionId || attacker === undefined || !outcomeType) {
    return undefined;
  }
  const mission = getMission(missionId);
  if (!mission) {
    return undefined;
  }
  if (outcomeType === 'time_out') {
    return -1;
  }
  if (outcomeType === 'objective_taken' && attacker !== undefined && mission?.victoryConditions.includes('attack_repelled')) {
    return attacker;
  }
  if (outcomeType === 'attack_repelled' && attacker !== undefined) {
    return attacker === 0 ? 1 : 0; // Defender
  }
};
