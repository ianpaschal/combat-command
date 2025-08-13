import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  BattlePlan,
  getMissionOptions,
  getMissionOutcomeOptions,
  MatchOutcomeType,
  MissionData,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { UserId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { FowV4MatchResultFormData } from '~/components/FowV4MatchResultForm/FowV4MatchResultForm.schema';
import { useGetUser } from '~/services/users';

export const usePlayerDisplayName = ({ userId, placeholder }: { userId?: UserId, placeholder?: string }): string => {
  const currentUser = useAuth();
  const { data: user } = useGetUser(userId ? { id: userId } : 'skip');
  if (!userId && placeholder) {
    return placeholder;
  }
  if (userId && !placeholder) {
    if (user?._id === currentUser?._id) {
      return 'You';
    }
    return user?.displayName ?? 'Unknown Player';
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

export const useMissionOptions = () => {
  const { watch } = useFormContext<FowV4MatchResultFormData>();
  const [player0BattlePlan, player1BattlePlan, missionPackVersion, missionMatrix] = watch([
    'details.player0BattlePlan',
    'details.player1BattlePlan',
    'gameSystemConfig.missionPackVersion',
    'gameSystemConfig.missionMatrix',
  ]);
  return useMemo(() => getMissionOptions(missionPackVersion, missionMatrix, [player0BattlePlan, player1BattlePlan]), [
    player0BattlePlan,
    player1BattlePlan,
    missionPackVersion,
    missionMatrix,
  ]);
};

export const useOutcomeTypeOptions = () => {
  const { watch } = useFormContext<FowV4MatchResultFormData>();
  const [missionPackVersion, mission] = watch([
    'gameSystemConfig.missionPackVersion',
    'details.mission',
  ]);
  return useMemo(() => getMissionOutcomeOptions(missionPackVersion, mission), [
    missionPackVersion,
    mission,
  ]);
};

export const computeAttacker = (
  mission: MissionData | null,
  battlePlans?: [BattlePlan | undefined, BattlePlan | undefined],
): 0 | 1 | undefined => {
  if (!mission || !battlePlans || !battlePlans[0] || !battlePlans[1]) {
    return undefined;
  }
  const [player0BattlePlan, player1BattlePlan] = battlePlans;
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

export const computeFirstTurn = (
  mission: MissionData | null,
  attacker?: 0 | 1,
): 0 | 1 | undefined => {
  if (!mission || attacker === undefined) {
    return undefined;
  }
  if (mission.firstTurn === 'roll') {
    return undefined;
  }
  if (mission.firstTurn === 'attacker') {
    return attacker;
  }
  if (mission.firstTurn === 'defender') {
    return attacker === 0 ? 1 : 0; // Defender
  }
};

export const computeWinner = (
  mission: MissionData | null,
  attacker?: 0 | 1,
  outcomeType?: MatchOutcomeType,
): -1 | 0 | 1 | undefined => {
  if (!mission || attacker === undefined || !outcomeType) {
    return undefined;
  }
  if (outcomeType === MatchOutcomeType.TimeOut) {
    return -1;
  }
  const canRepel = mission.victoryConditions.includes(MatchOutcomeType.AttackRepelled);
  if (outcomeType === MatchOutcomeType.ObjectiveTaken && attacker !== undefined && canRepel) {
    return attacker;
  }
  if (outcomeType === MatchOutcomeType.AttackRepelled && attacker !== undefined) {
    return attacker === 0 ? 1 : 0; // Defender
  }
};
