import { Doc, Id } from '../_generated/dataModel';
import { FowV4MatchOutcomeType } from '../common/fowV4/fowV4MatchOutcomeType';

export type CreateFakeMatchResultDataArgs = {
  tournamentPairingId: Id<'tournamentPairings'>;
  player0UserId: Id<'users'>;
  player1UserId: Id<'users'>;
};

export function createFakeMatchResultData(args: CreateFakeMatchResultDataArgs): Omit<Doc<'matchResults'>, '_id'|'_creationTime'|'player0Confirmed'|'player1Confirmed'> {
  const outcomeTypes: FowV4MatchOutcomeType[] = ['force_broken', 'objective_taken', 'time_out'];
  const outcomeType = outcomeTypes[Math.floor(Math.random() * outcomeTypes.length)];
  return {
    ...args,
    details: {
      attacker: Math.round(Math.random()) as 0 | 1,
      winner: outcomeType === 'time_out' ? -1 : Math.round(Math.random()) as 0 | 1,
      firstTurn: Math.round(Math.random()) as 0 | 1,
      player0BattlePlan: 'attack',
      player1BattlePlan: 'attack',
      missionId: 'foo',
      player1UnitsLost: Math.round(Math.random() * 6),
      player0UnitsLost: Math.round(Math.random() * 6),
      outcomeType,
      turnsPlayed: Math.round(Math.random() * 6),
    },
    playedAt: new Date().toISOString(),
    gameSystemConfig: {
      points: 100,
      eraId: 'mw',
      lessonsFromTheFrontVersionId: '',
      missionMatrixId: '',
      missionPackId: '',
    },
    gameSystemId: 'flames_of_war_v4',
  };
}
