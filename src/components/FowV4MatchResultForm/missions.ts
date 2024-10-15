import { FowV4Stance, fowV4StanceOptions } from '~/types/fowV4/fowV4StanceSchema';

interface Mission {
  id: string;
  label: string;
  attacker: 'roll' | 'stance';
  firstTurn: 'attacker' | 'defender' | 'roll';
}

export const missions: Mission[] = [
  {
    id: '2023_04_annihilation',
    label: 'Annihilation',
    attacker: 'roll',
    firstTurn: 'roll',
  },
  {
    id: '2023_04_breakthrough',
    label: 'Breakthrough',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: '2023_04_bridgehead',
    label: 'Bridgehead',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: '2023_04_bypass',
    label: 'Bypass',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: '2023_04_cornered',
    label: 'Cornered',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: '2023_04_counterattack',
    label: 'Counterattack',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: '2023_04_counterstrike',
    label: 'Counterstrike',
    attacker: 'stance',
    firstTurn: 'defender',
  },
  {
    id: '2023_04_covering_force',
    label: 'Covering Force',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'dogfight',
    label: 'Dogfight',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'dust_up',
    label: 'Dust-Up',
    attacker: 'roll',
    firstTurn: 'roll',
  },
  {
    id: 'encirclement',
    label: 'Encirclement',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'encounter',
    label: 'Encounter',
    attacker: 'roll',
    firstTurn: 'roll',
  },
  {
    id: 'escape',
    label: 'Escape',
    attacker: 'stance',
    firstTurn: 'defender',
  },
  {
    id: 'fighting_withdrawal',
    label: 'Fighting Withdrawal',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'gauntlet',
    label: 'Gauntlet',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'hold_the_pocket',
    label: 'Hold the Pocket',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'its_a_trap',
    label: 'It\'s a Trap',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'killing_ground',
    label: 'Killing Ground',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'no_retreat',
    label: 'No Retreat',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'outflanked',
    label: 'Outflanked',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'outmanoeuvred',
    label: 'Outmaneuvered',
    attacker: 'stance',
    firstTurn: 'defender',
  },
  {
    id: 'probe',
    label: 'Probe',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'scouts_out',
    label: 'Scouts Out',
    attacker: 'roll',
    firstTurn: 'roll',
  },
  {
    id: 'spearpoint',
    label: 'Spearpoint',
    attacker: 'stance',
    firstTurn: 'defender',
  },
  {
    id: 'valley_of_death',
    label: 'Valley of Death',
    attacker: 'stance',
    firstTurn: 'attacker',
  },
  {
    id: 'vanguard',
    label: 'Vanguard',
    attacker: 'roll',
    firstTurn: 'roll',
  },
];

export const getAttackerByStances = (stance0: FowV4Stance, stance1: FowV4Stance): 0 | 1 | null => {
  const values = [...fowV4StanceOptions].reverse().map((option) => option.value);
  const aggression0 = values.indexOf(stance0);
  const aggression1 = values.indexOf(stance1);
  if (aggression1 > aggression0) {
    return 1;
  }
  if (aggression0 > aggression1) {
    return 0;
  }
  return null;
};