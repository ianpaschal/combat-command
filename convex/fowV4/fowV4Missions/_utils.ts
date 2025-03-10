import { FowV4BattlePlan } from '../../common/fowV4/fowV4BattlePlan';

type GetRolesByStancesResult = { attacker: 0, defender: 1 } | { attacker: 1, defender: 0 };

export const getRolesByStances = (stance0: FowV4BattlePlan, stance1: FowV4BattlePlan): GetRolesByStancesResult | undefined => {

  // Least aggressive to most aggressive
  const values = ['defend', 'maneuver', 'attack'];

  const player0Aggression = values.indexOf(stance0);
  const player1Aggression = values.indexOf(stance1);
  
  if (player1Aggression > player0Aggression) {
    return { attacker: 1, defender: 0 };
  }
  if (player0Aggression > player1Aggression) {
    return { attacker: 0, defender: 1 };
  }
};
