import { BattlePlan, MatchOutcomeType } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { Doc } from '../../../_generated/dataModel';

type FairFightBattlePlanPair = 'att_att' | 'man_man' | 'def_def';

type AsymmetricalBattlePlanPair = 'att_man' | 'att_def' | 'man_def';

type BattlePlanPair = FairFightBattlePlanPair | AsymmetricalBattlePlanPair;

type OutcomeDistribution = Record<BattlePlanPair, {
  firstTurnWins: number;
  secondTurnWins: number;
  attackerWins: number;
  defenderWins: number;
  draw: number;
  total: number;
}>;

const getBattlePlanPair = (a: BattlePlan, b: BattlePlan): BattlePlanPair => {
  if (a === b) {
    if (a === BattlePlan.Attack) {
      return 'att_att';
    }
    if (a === BattlePlan.Maneuver) {
      return 'man_man';
    }
    if (a === BattlePlan.Defend) {
      return 'def_def';
    }
  } else {
    const plans = new Set([a,b]);
    if (plans.has(BattlePlan.Attack) && plans.has(BattlePlan.Maneuver)) {
      return 'att_man';
    }
    if (plans.has(BattlePlan.Attack) && plans.has(BattlePlan.Defend)) {
      return 'att_def';
    }
    if (plans.has(BattlePlan.Maneuver) && plans.has(BattlePlan.Defend)) {
      return 'man_def';
    }
  }
  throw new Error('No battle plan pair found!');
};

export const getOutcomeDistributionByBattlePlan = async (
  data: Doc<'matchResults'>[], 
): Promise<OutcomeDistribution> => data.reduce((acc, { details }) => {
  const key = getBattlePlanPair(details.player0BattlePlan, details.player1BattlePlan);
  return {
    ...acc,
    [key]: {
      firstTurnWins: (acc[key].firstTurnWins ?? 0) + (details.firstTurn === details.winner ? 1 : 0),
      secondTurnWins: (acc[key].secondTurnWins ?? 0) + (details.winner !== -1 && details.firstTurn !== details.winner ? 0 : 1),
      attackerWins: (acc[key].attackerWins ?? 0) + (details.attacker === details.winner ? 1 : 0),
      defenderWins: (acc[key].defenderWins ?? 0) + (details.winner !== -1 && details.attacker !== details.winner ? 0 : 1),
      draw: (acc[key].draw ?? 0) + (details.outcomeType === MatchOutcomeType.TimeOut ? 1 : 0),
      total: (acc[key].total ?? 0) + 1,
    },
  };
}, {} as OutcomeDistribution);
