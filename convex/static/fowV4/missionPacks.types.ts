import { FowV4MatchOutcomeType } from '../../common/fowV4/fowV4MatchOutcomeType';

export type FowV4MissionPack = {
  id: string;
  displayName: string;
  publishedAt: string;
  missions: FowV4Mission[];
  matrixes: FowV4MissionPackMatrix[];
};

export type FowV4Mission = {
  id: string;
  displayName: string;
  attacker: 'roll' | 'battle_plan';
  firstTurn: 'roll' | 'attacker' | 'defender';
  victoryConditions: FowV4MatchOutcomeType[];
};

export type FowV4MissionPackMatrix = {
  id: string;
  displayName: string;
  entries: FowV4MissionPackMatrixEntry[];
};

export type FowV4MissionMatrixEntryOption = [string, string] | string;

export type FowV4MissionPackMatrixEntry = {
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
