import { GameSystem } from '@ianpaschal/combat-command-static-data/common';
import {
  BattlePlan,
  Era,
  LessonsFromTheFrontVersion,
  MatchOutcomeType,
  MissionName,
  MissionPackVersion,
} from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { CreateMatchResultArgs } from '../../_model/matchResults';

export const createMockFowV4MatchResultData = (
  data: Partial<Omit<CreateMatchResultArgs, 'player0UserId'>>,
): CreateMatchResultArgs => {
  const outcomeType = Math.random() > 0.25 ? MatchOutcomeType.ObjectiveTaken : MatchOutcomeType.TimeOut;
  return {
    playedAt: new Date().toISOString(),
    details: {
      attacker: 0,
      firstTurn: 0,
      mission: MissionName.Spearpoint,
      outcomeType,
      player0BattlePlan: BattlePlan.Attack,
      player0UnitsLost: Math.round(Math.random() * 5) + 2,
      player1BattlePlan: BattlePlan.Attack,
      player1UnitsLost: Math.round(Math.random() * 5) + 2,
      turnsPlayed: Math.round(Math.random() * 5) + 2,
      winner: outcomeType === 'time_out' ? -1 : (Math.random() > 0.5 ? 1 : 0),
    },
    gameSystemConfig: {
      points: 100,
      era: Era.LW,
      lessonsFromTheFrontVersion: LessonsFromTheFrontVersion.Mar2024,
      missionPackVersion: MissionPackVersion.Apr2023,
      missionMatrix: 'extended',
    },
    gameSystem: GameSystem.FlamesOfWarV4,
    ...data,
  };
};
