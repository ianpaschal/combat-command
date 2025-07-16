import { CreateMatchResultArgs } from '../../_model/matchResults';

export const createMockFowV4MatchResultData = (
  data: Partial<Omit<CreateMatchResultArgs, 'player0UserId'>>,
): CreateMatchResultArgs => {
  const outcomeType = Math.random() > 0.25 ? 'objective_taken' : 'time_out';
  return {
    playedAt: new Date().toISOString(),
    details: {
      attacker: 0,
      firstTurn: 0,
      missionId: 'flames_of_war_v4::mission::2023_04_spearpoint',
      outcomeType,
      player0BattlePlan: 'attack',
      player0UnitsLost: Math.round(Math.random() * 5) + 2,
      player1BattlePlan: 'attack',
      player1UnitsLost: Math.round(Math.random() * 5) + 2,
      turnsPlayed: Math.round(Math.random() * 5) + 2,
      winner: outcomeType === 'time_out' ? -1 : (Math.random() > 0.5 ? 1 : 0),
    },
    gameSystemConfig: {
      points: 100,
      eraId: 'flames_of_war_v4::era::late_war',
      lessonsFromTheFrontVersionId: 'flames_of_war_v4::lessons_from_the_front_version::2024_03',
      missionPackId: 'flames_of_war_v4::mission_pack::2023_04',
      missionMatrixId: 'flames_of_war_v4::mission_matrix::2023_04_extended',
    },
    gameSystemId: 'flames_of_war_v4',
    ...data,
  };
};
