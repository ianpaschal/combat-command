import { Doc } from '../../../_generated/dataModel';

export type TournamentRoundStructure = Doc<'tournaments'>['roundStructure'];

export const convertRoundStructureToMs = (
  structure: TournamentRoundStructure,
): Record<keyof TournamentRoundStructure, number> => (
  Object.entries(structure).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: (value ?? 0) * 60000,
  }), {} as Record<keyof TournamentRoundStructure, number>)
);
