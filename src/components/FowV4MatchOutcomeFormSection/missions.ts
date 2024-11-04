import { InputSelectOption } from '~/components/generic/InputSelect';
import { FowV4MissionPackVersion } from '~/types/fowV4/fowV4MissionPackVersionSchema';
import { FowV4Stance, fowV4StanceOptions } from '~/types/fowV4/fowV4StanceSchema';

interface Mission {
  id: string;
  label: string;
  attacker: 'roll' | 'stance';
  firstTurn: 'attacker' | 'defender' | 'roll';
  objectives: {
    attacker: boolean; // Does the attacker need to capture objectives?
    defender: boolean; // Does the attacker need to capture objectives?
  }
}

export const missions: Mission[] = [
  {
    id: '2023_04_annihilation',
    label: 'Annihilation',
    attacker: 'roll',
    firstTurn: 'roll',
    objectives: {
      attacker: false,
      defender: false,
    },
  },
  {
    id: '2023_04_breakthrough',
    label: 'Breakthrough',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_bridgehead',
    label: 'Bridgehead',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_bypass',
    label: 'Bypass',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: true,
    },
  },
  {
    id: '2023_04_cornered',
    label: 'Cornered',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_counterattack',
    label: 'Counterattack',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_counterstrike',
    label: 'Counterstrike',
    attacker: 'stance',
    firstTurn: 'defender',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_covering_force',
    label: 'Covering Force',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_dogfight',
    label: 'Dogfight',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_dust_up',
    label: 'Dust-Up',
    attacker: 'roll',
    firstTurn: 'roll',
    objectives: {
      attacker: true,
      defender: true,
    },
  },
  {
    id: '2023_04_encirclement',
    label: 'Encirclement',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_encounter',
    label: 'Encounter',
    attacker: 'roll',
    firstTurn: 'roll',
    objectives: {
      attacker: true,
      defender: true,
    },
  },
  {
    id: '2023_04_escape',
    label: 'Escape',
    attacker: 'stance',
    firstTurn: 'defender',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_fighting_withdrawal',
    label: 'Fighting Withdrawal',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_free_for_all',
    label: 'Free for All',
    attacker: 'roll',
    firstTurn: 'roll',
    objectives: {
      attacker: true,
      defender: true,
    },
  },
  {
    id: '2023_04_gauntlet',
    label: 'Gauntlet',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_hold_the_pocket',
    label: 'Hold the Pocket',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_its_a_trap',
    label: 'It\'s a Trap',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_killing_ground',
    label: 'Killing Ground',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_no_retreat',
    label: 'No Retreat',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_outflanked',
    label: 'Outflanked',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_outmaneuvered',
    label: 'Outmaneuvered',
    attacker: 'stance',
    firstTurn: 'defender',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_probe',
    label: 'Probe',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: true,
    },
  },
  {
    id: '2023_04_scouts_out',
    label: 'Scouts Out',
    attacker: 'roll',
    firstTurn: 'roll',
    objectives: {
      attacker: true,
      defender: true,
    },
  },
  {
    id: '2023_04_spearpoint',
    label: 'Spearpoint',
    attacker: 'stance',
    firstTurn: 'defender',
    objectives: {
      attacker: true,
      defender: true,
    },
  },
  {
    id: '2023_04_valley_of_death',
    label: 'Valley of Death',
    attacker: 'stance',
    firstTurn: 'attacker',
    objectives: {
      attacker: true,
      defender: false,
    },
  },
  {
    id: '2023_04_vanguard',
    label: 'Vanguard',
    attacker: 'roll',
    firstTurn: 'roll',
    objectives: {
      attacker: true,
      defender: true,
    },
  },
];

export const getRolesByStances = (stance0: FowV4Stance, stance1: FowV4Stance): { attacker: 0|1, defender: 0|1 } | undefined=> {
  const values = [...fowV4StanceOptions].reverse().map((option) => option.value);
  const player0Aggression = values.indexOf(stance0);
  const player1Aggression = values.indexOf(stance1);
  if (player1Aggression > player0Aggression) {
    return { attacker: 1, defender: 0 };
  }
  if (player0Aggression > player1Aggression) {
    return { attacker: 0, defender: 1 };
  }
};

export interface MissionMatrix {
  id: string;
  name: string;
  mission_pack_version_id: FowV4MissionPackVersion;
  battlePlanSets: {
    stances: [FowV4Stance, FowV4Stance];
    missions: (string | [string, string])[];
  }[];
}

const missionMatrices: MissionMatrix[] = [
  {
    id: 'mission_pack_2023_04_extended_battle_plans',
    name: 'Extended Battle Plans',
    mission_pack_version_id: 'mission_pack_2023_04',
    battlePlanSets: [
      {
        stances: ['attack', 'attack'],
        missions: [
          ['2023_04_counterattack', '2023_04_counterstrike'],
          '2023_04_dust_up',
          '2023_04_encounter',
          '2023_04_free_for_all',
          '2023_04_probe',
          '2023_04_scouts_out',
        ],
      },
      {
        stances: ['attack', 'maneuver'],
        missions: [
          '2023_04_breakthrough',
          ['2023_04_counterattack', '2023_04_counterstrike'],
          '2023_04_escape',
          ['2023_04_fighting_withdrawal', '2023_04_covering_force'],
          ['2023_04_spearpoint', '2023_04_bypass'],
          '2023_04_valley_of_death',
        ],
      },
      {
        stances: ['attack', 'defend'],
        missions: [
          '2023_04_bridgehead',
          '2023_04_dogfight',
          ['2023_04_encirclement', '2023_04_hold_the_pocket'],
          ['2023_04_fighting_withdrawal', '2023_04_covering_force'],
          ['2023_04_killing_ground', '2023_04_its_a_trap'],
          '2023_04_no_retreat',
        ],
      },
      {
        stances: ['maneuver', 'maneuver'],
        missions: [
          ['2023_04_counterattack', '2023_04_counterstrike'],
          '2023_04_dust_up',
          '2023_04_encounter',
          ['2023_04_outflanked', '2023_04_outmaneuvered'],
          '2023_04_probe',
          '2023_04_scouts_out',
        ],
      },
      {
        stances: ['maneuver', 'defend'],
        missions: [
          '2023_04_breakthrough',
          '2023_04_cornered',
          '2023_04_no_retreat',
          ['2023_04_outflanked', '2023_04_outmaneuvered'],
          ['2023_04_spearpoint', '2023_04_bypass'],
          '2023_04_valley_of_death',
        ],
      },
      {
        stances: ['defend', 'defend'],
        missions: [
          '2023_04_breakthrough',
          '2023_04_dust_up',
          '2023_04_encounter',
          '2023_04_free_for_all',
          '2023_04_probe',
          '2023_04_scouts_out',
        ],
      },
    ],
  },
];

type GetMissionOptionsConfig = {
  matrixId?: string;
  useAlternates?: boolean;
};

export const getMissionOptions = (
  stance0?: FowV4Stance,
  stance1?: FowV4Stance,
  config?: GetMissionOptionsConfig,
): InputSelectOption<string>[] => {
  if (!stance0 || !stance1 || !config?.matrixId ) {
    return missions.map(({ label, id }) => ({ label, value: id }));
  }
  const matrix = missionMatrices.find(({ id }) => id === config.matrixId);
  if (!matrix) {
    throw Error('Could not find a mission matrix with that ID!');
  }

  const battlePlanSet = matrix.battlePlanSets.find(({ stances }) => (
    (stance0 === stances[0] && stance1 === stances[1]) || (stance1 === stances[0] && stance0 === stances[1])
  ))!;
  const missionIds = battlePlanSet.missions.reduce((acc, item) => {
    if (Array.isArray(item)) {
      if (config?.useAlternates) {
        return [...acc, item[1]];
      }
      return [ ...acc, ...item];
    }
    return [ ...acc,item];
  }, [] as string[]);

  return missions.filter(({ id }) => missionIds.includes(id)).map(({ label, id }) => ({ label, value: id }));
};

type GetAttackerOptionsPlayer = {
  stance?: FowV4Stance,
  label: string,
};

export const getAttackerOptions = (
  players: GetAttackerOptionsPlayer[],
  missionId?: string,
): InputSelectOption<number>[] => {
  if (!players[0].stance || !players[1].stance || !missionId ) {
    return players.map(({ label }, i) => ({ label, value: i }));
  }

  const mission = missions.find(({ id }) => id === missionId);
  if (!mission) {
    throw Error('Could not find a mission with that ID!');
  }

  if (players[0].stance !== players[1].stance && mission.attacker !== 'roll') {

    const roles = getRolesByStances(players[0].stance, players[1].stance);
    if (roles?.attacker) {
      return [{
        label: players[roles.attacker].label,
        value: roles.attacker,
      }];
    }
  }
  return players.map(({ label }, i) => ({ label, value: i }));
};