import { FowV4MatchOutcomeType } from '../../common/fowV4/fowV4MatchOutcomeType';

export type FowV4MissionPack = {
  id: string;
  displayName: string;
  publishedAt: string;
  missions: FowV4Mission[];
  matrixes: FowV4MissionMatrix[];
};

export type FowV4MissionAttacker = 'roll' | 'battle_plan';

export type FowV4MissionFirstTurn = 'roll' | 'attacker' | 'defender';

export type FowV4Mission = {
  id: string;
  displayName: string;
  attacker: FowV4MissionAttacker;
  firstTurn: FowV4MissionFirstTurn;
  victoryConditions: FowV4MatchOutcomeType[];
};

export type FowV4MissionMatrix = {
  id: string;
  displayName: string;
  entries: FowV4MissionMatrixEntry[];
};

export type FowV4MissionMatrixEntryOption = [string, string] | string;

export type FowV4MissionMatrixEntry = {
  battlePlans: [string, string];
  missions: [
    FowV4MissionMatrixEntryOption,
    FowV4MissionMatrixEntryOption,
    FowV4MissionMatrixEntryOption,
    FowV4MissionMatrixEntryOption,
    FowV4MissionMatrixEntryOption,
    FowV4MissionMatrixEntryOption
  ];
};
