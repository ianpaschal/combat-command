import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FowV4MatchOutcomeType } from 'convex/common/fowV4/fowV4MatchOutcomeType';
import { useQuery } from 'convex/react';

import { api, UserId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

export const usePlayerDisplayName = ({ userId, placeholder }: { userId: UserId, placeholder: string }): string => {
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

export const usePlayerDisplayNames = (): [string, string] => {
  const { watch } = useFormContext();
  const {
    player0UserId,
    player1UserId,
    player0Placeholder,
    player1Placeholder,
  } = watch();
  return [
    usePlayerDisplayName({ userId: player0UserId, placeholder: player0Placeholder }),
    usePlayerDisplayName({ userId: player1UserId, placeholder: player1Placeholder }),
  ];
};

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
  const missions = useQuery(api.fowV4.fowV4Missions.queries.getMissionsByBattlePlans, missionPackId ? {
    player0BattlePlan,
    player1BattlePlan,
    missionPackId,
    missionMatrixId,
    useAlternates: useExperimentalMissions,
  } : 'skip');
  return (missions || []).map((mission) => ({
    label: mission.displayName,
    value: mission._id,
  }));
};

export const useAttackerOptions = (autoSet = true) => {
  const { setValue, watch } = useFormContext();
  const {
    attacker,
    missionId,
    player0BattlePlan,
    player1BattlePlan,
  } = watch().details;

  const playerDisplayNames = usePlayerDisplayNames();

  const missionAttacker = useQuery(api.fowV4.fowV4Missions.queries.getMissionAttacker, missionId ? {
    player0BattlePlan,
    player1BattlePlan,
    missionId,
  } : 'skip');

  const attackerOptions = (missionAttacker || []).map((playerIndex) => ({
    label: playerDisplayNames[playerIndex],
    value: playerIndex,
  }));

  useEffect(() => {
    if (autoSet && attackerOptions && attackerOptions.length === 1 && attacker !== attackerOptions[0].value) {
      setValue('details.attacker', attackerOptions[0].value);
    }
  }, [autoSet, attackerOptions, attacker, setValue]);

  return attackerOptions;
};

export const useFirstTurnOptions = (autoSet = true) => {
  const { setValue, watch } = useFormContext();
  const {
    firstTurn,
    missionId,
    player0BattlePlan,
    player1BattlePlan,
  } = watch().details;

  const playerDisplayNames = usePlayerDisplayNames();

  const missionFirstTurn = useQuery(api.fowV4.fowV4Missions.queries.getMissionFirstTurn, missionId ? {
    player0BattlePlan,
    player1BattlePlan,
    missionId,
  } : 'skip');

  const firstTurnOptions = (missionFirstTurn || []).map((playerIndex) => ({
    label: playerDisplayNames[playerIndex],
    value: playerIndex,
  }));

  useEffect(() => {
    if (autoSet && firstTurnOptions && firstTurnOptions.length === 1 && firstTurn !== firstTurnOptions[0].value) {
      setValue('details.firstTurn', firstTurnOptions[0].value);
    }
  }, [autoSet, firstTurnOptions, firstTurn, setValue]);

  return firstTurnOptions;
};

export const useOutcomeTypeOptions = () => {
  const { watch } = useFormContext();
  const {
    missionId,
  } = watch().details;

  const mission = useQuery(api.fowV4.fowV4Missions.queries.getMission, missionId ? {
    id: missionId,
  } : 'skip');

  const outcomeTypeNames: Record<FowV4MatchOutcomeType, string> = {
    ['force_broken']: 'Force Broken',
    ['objective_taken']: 'Objective Captured',
    ['attack_repelled']: 'Attack Repelled',
    ['time_out']: 'Time Out / Draw',   
  };

  return (mission?.outcomeTypes || []).map((outcomeType) => ({
    label: outcomeTypeNames[outcomeType], value: outcomeType,
  }));
};

export const useWinnerOptions = (autoSet = true) => {
  const { setValue, watch } = useFormContext();
  const {
    missionId,
    attacker,
    outcomeType,
    player0BattlePlan,
    player1BattlePlan,
    winner,
  } = watch().details;

  const playerDisplayNames = usePlayerDisplayNames();

  const missionWinner = useQuery(api.fowV4.fowV4Missions.queries.getMissionWinner, missionId ? {
    player0BattlePlan,
    player1BattlePlan,
    missionId,
    attacker,
    outcomeType,
  } : 'skip');

  const winnerOptions = (missionWinner || []).map((playerIndex) => ({
    label: playerIndex === null ? 'None' : playerDisplayNames[playerIndex],
    value: playerIndex,
  }));

  useEffect(() => {
    if (autoSet && winnerOptions && winnerOptions.length === 1 && winner !== winnerOptions[0].value) {
      setValue('details.winner', winnerOptions[0].value);
    }
  }, [autoSet, winnerOptions, winner, setValue]);
  
  return winnerOptions;
};
