import { Infer, v } from 'convex/values';

import {
  FowV4Mission,
  FowV4MissionMatrix,
  FowV4MissionPack,
} from './missionPacks.types';

export const missionPacks: FowV4MissionPack[] = [
  {
    id: 'flames_of_war_v4::mission_pack::2023_04',
    displayName: 'April 2023',
    publishedAt: '2023-04-01T13:00:00+13:00',
    missions: [
      {
        id: 'flames_of_war_v4::mission::2023_04_vanguard',
        attacker: 'roll',
        displayName: 'Vanguard',
        firstTurn: 'roll',
        victoryConditions: [
          'objective_taken',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_valley_of_death',
        attacker: 'battle_plan',
        displayName: 'Valley of Death',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_spearpoint',
        attacker: 'battle_plan',
        displayName: 'Spearpoint',
        firstTurn: 'defender',
        victoryConditions: [
          'objective_taken',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_scouts_out',
        attacker: 'roll',
        displayName: 'Scouts Out',
        firstTurn: 'roll',
        victoryConditions: [
          'objective_taken',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_probe',
        attacker: 'battle_plan',
        displayName: 'Probe',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_outmaneuvered',
        attacker: 'battle_plan',
        displayName: 'Outmaneuvered',
        firstTurn: 'defender',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_outflanked',
        attacker: 'battle_plan',
        displayName: 'Outflanked',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_no_retreat',
        attacker: 'battle_plan',
        displayName: 'No Retreat',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_killing_ground',
        attacker: 'battle_plan',
        displayName: 'Killing Ground',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      { 
        id: 'flames_of_war_v4::mission::2023_04_its_a_trap',
        attacker: 'battle_plan',
        displayName: 'It’s a Trap',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_hold_the_pocket',
        attacker: 'battle_plan',
        displayName: 'Hold the Pocket',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_gauntlet',
        attacker: 'battle_plan',
        displayName: 'Gauntlet',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_free_for_all',
        attacker: 'roll',
        displayName: 'Free for All',
        firstTurn: 'roll',
        victoryConditions: [
          'objective_taken',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_fighting_withdrawal',
        attacker: 'battle_plan',
        displayName: 'Fighting Withdrawal',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_escape',
        attacker: 'battle_plan',
        displayName: 'Escape',
        firstTurn: 'defender',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_encounter',
        attacker: 'roll',
        displayName: 'Encounter',
        firstTurn: 'roll',
        victoryConditions: [
          'objective_taken',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_encirclement',
        attacker: 'battle_plan',
        displayName: 'Encirclement',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_dust_up',
        attacker: 'roll',
        displayName: 'Dust-Up',
        firstTurn: 'roll',
        victoryConditions: [
          'objective_taken',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_dog_fight',
        attacker: 'battle_plan',
        displayName: 'Dogfight',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_covering_force',
        attacker: 'battle_plan',
        displayName: 'Covering Force',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_counterstrike',
        attacker: 'battle_plan',
        displayName: 'Counterstrike',
        firstTurn: 'defender',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_counterattack',
        attacker: 'battle_plan',
        displayName: 'Counterattack',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_cornered',
        attacker: 'battle_plan',
        displayName: 'Cornered',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_bypass',
        attacker: 'battle_plan',
        displayName: 'Bypass',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_bridgehead',
        attacker: 'battle_plan',
        displayName: 'Bridgehead',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_breakthrough',
        attacker: 'battle_plan',
        displayName: 'Breakthrough',
        firstTurn: 'attacker',
        victoryConditions: [
          'objective_taken',
          'attack_repelled',
        ],
      },
      {
        id: 'flames_of_war_v4::mission::2023_04_annihilation',
        attacker: 'roll',
        displayName: 'Annihilation',
        firstTurn: 'roll',
        victoryConditions: [],
      },
    ],
    matrixes: [
      {
        id: 'flames_of_war_v4::mission_matrix::2023_04_extended',
        displayName: 'Extended Battle Plans',
        entries: [
          {
            battlePlans: ['attack', 'attack'],
            missions: [
              ['flames_of_war_v4::mission::2023_04_counterattack', 'flames_of_war_v4::mission::2023_04_counterstrike'],
              'flames_of_war_v4::mission::2023_04_dust_up',
              'flames_of_war_v4::mission::2023_04_encounter',
              'flames_of_war_v4::mission::2023_04_free_for_all',
              'flames_of_war_v4::mission::2023_04_probe',
              'flames_of_war_v4::mission::2023_04_scouts_out',
            ],
          },
          {
            battlePlans: ['attack', 'maneuver'],
            missions: [
              'flames_of_war_v4::mission::2023_04_breakthrough',
              ['flames_of_war_v4::mission::2023_04_counterattack', 'flames_of_war_v4::mission::2023_04_counterstrike'],
              'flames_of_war_v4::mission::2023_04_escape',
              ['flames_of_war_v4::mission::2023_04_fighting_withdrawal', 'flames_of_war_v4::mission::2023_04_covering_force'],
              ['flames_of_war_v4::mission::2023_04_spearpoint', 'flames_of_war_v4::mission::2023_04_bypass'],
              'flames_of_war_v4::mission::2023_04_valley_of_death',
            ],
          },
          {
            battlePlans: ['attack', 'defend'],
            missions: [
              'flames_of_war_v4::mission::2023_04_bridgehead',
              'flames_of_war_v4::mission::2023_04_dog_fight',
              ['flames_of_war_v4::mission::2023_04_encirclement', 'flames_of_war_v4::mission::2023_04_hold_the_pocket'],
              ['flames_of_war_v4::mission::2023_04_fighting_withdrawal', 'flames_of_war_v4::mission::2023_04_covering_force'],
              ['flames_of_war_v4::mission::2023_04_killing_ground', 'flames_of_war_v4::mission::2023_04_its_a_trap'],
              'flames_of_war_v4::mission::2023_04_no_retreat',
            ],
          },
          {
            battlePlans: ['maneuver', 'maneuver'],
            missions: [
              ['flames_of_war_v4::mission::2023_04_counterattack', 'flames_of_war_v4::mission::2023_04_counterstrike'],
              'flames_of_war_v4::mission::2023_04_dust_up',
              'flames_of_war_v4::mission::2023_04_encounter',
              ['flames_of_war_v4::mission::2023_04_outflanked', 'flames_of_war_v4::mission::2023_04_outmaneuvered'],
              'flames_of_war_v4::mission::2023_04_probe',
              'flames_of_war_v4::mission::2023_04_scouts_out',
            ],
          },
          {
            battlePlans: ['maneuver','defend'],
            missions: [
              'flames_of_war_v4::mission::2023_04_breakthrough',
              'flames_of_war_v4::mission::2023_04_cornered',
              'flames_of_war_v4::mission::2023_04_no_retreat',
              ['flames_of_war_v4::mission::2023_04_outflanked', 'flames_of_war_v4::mission::2023_04_outmaneuvered'],
              ['flames_of_war_v4::mission::2023_04_spearpoint', 'flames_of_war_v4::mission::2023_04_bypass'],
              'flames_of_war_v4::mission::2023_04_valley_of_death',
            ],
          },
          {
            battlePlans: ['defend','defend'],
            missions: [
              'flames_of_war_v4::mission::2023_04_breakthrough',
              'flames_of_war_v4::mission::2023_04_dust_up',
              'flames_of_war_v4::mission::2023_04_encounter',
              'flames_of_war_v4::mission::2023_04_free_for_all',
              'flames_of_war_v4::mission::2023_04_probe',
              'flames_of_war_v4::mission::2023_04_scouts_out',
            ],
          },
        ],
      },
    ],
  },
  // {
  //   id: 'flames_of_war_v4_mission_pack_2022-06',
  //   displayName: 'June 2022',
  //   publishedAt: '2022-06-01T13:00:00+13:00',
  //   missions: [

  //   ],
  //   matrixes: [
      
  //   ],
  // },
  // {
  //   id: 'flames_of_war_v4_mission_pack_2021-03',
  //   displayName: 'March 2021',
  //   publishedAt: '2021-03-01T13:00:00+13:00',
  //   missions: [

  //   ],
  //   matrixes: [
      
  //   ],
  // },
] as const;

export const fowV4MissionPackOptions = missionPacks.map((version) => ({
  value: version.id,
  label: version.displayName,
}));

export const fowV4MissionPackId = v.union(...missionPacks.map(({ id }) => v.literal(id)));

export type FowV4MissionPackId = Infer<typeof fowV4MissionPackId>;

export const fowV4MissionMatrixId = v.union(
  ...missionPacks.reduce((acc: FowV4MissionMatrix[], missionPack) => [
    ...acc,
    ...missionPack.matrixes,
  ], []).map(({ id }) => v.literal(id)),
);

export type FowV4MissionMatrixId = Infer<typeof fowV4MissionMatrixId>;

export const fowV4MissionId = v.union(
  ...missionPacks.reduce((acc: FowV4Mission[], missionPack) => [
    ...acc,
    ...missionPack.missions,
  ], []).map(({ id }) => v.literal(id)),
);

export type FowV4MissionId = Infer<typeof fowV4MissionId>;

export const getFowV4MissionMatrixesByMissionPackId = (id: string): FowV4MissionMatrix[] | undefined => (
  missionPacks.find((missionPack) => missionPack.id === id)?.matrixes
);

export const getFowV4MissionMatrixOptionsByMissionPackId = (
  id?: string,
) => {
  if (!id) {
    return [];
  }
  const matrixes = getFowV4MissionMatrixesByMissionPackId(id);
  if (!matrixes?.length) {
    return [];
  }
  return matrixes.map((matrix) => ({
    value: matrix.id,
    label: matrix.displayName,
  }));
};
