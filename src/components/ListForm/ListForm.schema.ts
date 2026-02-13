import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { z } from 'zod';

import {
  StorageId,
  TournamentRegistrationId,
  UserId,
} from '~/api';

// FUTURE: Add data object sub-types
// export type FormationEntry = {
//   id: string;
//   sourceId: Unit;
// };
// export type UnitEntry = {
//   id: string;
//   sourceId: Unit;
//   formationId: string;
//   slotId: string;
// };
// export type CommandCardEntry = {
//   id: string;
//   sourceId: string;
//   appliedTo: string;
// };

export const schema = z.object({
  gameSystem: z.nativeEnum(GameSystem),
  storageId: z.string({ message: 'Please upload a list file.' }).transform((val) => val as StorageId),
  tournamentRegistrationId: z.string().nullable().transform((val) => (val ?? undefined) as TournamentRegistrationId | undefined),
  userId: z.string({ message: 'User is required.' }).transform((val) => val as UserId),
  // FUTURE: Add data object (use schema from combat-command-game-systems)
  // data: z.object({
  //   meta: z.object({
  //     forceDiagram: z.nativeEnum(ForceDiagram, {
  //       message: 'Please select a force diagram.',
  //     }),
  //     pointsLimit: z.coerce.number().min(1, 'Points limit must be at least 1.'),
  //   }),
  //   formations: z.array(z.object({
  //     id: z.string(),
  //     sourceId: z.nativeEnum(Unit, {
  //       message: 'Please select a formation.',
  //     }),
  //   })),
  //   units: z.array(z.object({
  //     id: z.string(),
  //     sourceId: z.nativeEnum(Unit, {
  //       message: 'Please select a unit.',
  //     }),
  //     formationId: z.string(),
  //     slotId: z.string(),
  //   })),
  //   commandCards: z.array(z.object({
  //     id: z.string(),
  //     sourceId: z.string(),
  //     appliedTo: z.string(),
  //   })),
  // }),
});

/**
 * The output of successful form validation.
 */
export type SubmitData = z.infer<typeof schema>;

/**
 * The internal form state before validation (may contain missing or intermediate values).
 */
export type FormData = {
  gameSystem: GameSystem;
  storageId: StorageId | null;
  tournamentRegistrationId: TournamentRegistrationId | null;
  userId: UserId | null;
  // FUTURE: Add data object (use type from combat-command-game-systems)
  // data: {
  //   meta: {
  //     forceDiagram: ForceDiagram;
  //     pointsLimit: number;
  //   },
  //   formations: FormationEntry[];
  //   units: UnitEntry[];
  //   commandCards: CommandCardEntry[];
  // },
};

export const defaultValues: FormData = {
  gameSystem: GameSystem.FlamesOfWarV4,
  storageId: null,
  tournamentRegistrationId: null,
  userId: null,
  // FUTURE: Add data object (use default values from combat-command-game-systems)
  // data: {
  //   meta: {
  //     forceDiagram: ForceDiagram.BerlinGerman,
  //     pointsLimit: 100,
  //   },
  //   formations: [],
  //   units: [],
  //   commandCards: [],
  // },
};
