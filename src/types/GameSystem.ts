import { z, ZodLiteral } from 'zod';

export const gameSystemSchema = z.union([
  z.literal('flames_of_war_v4'),
  z.literal('team_yankee_v2'),
]);

export type GameSystem = z.infer<typeof gameSystemSchema>;

export const gameSystemLabels: Record<GameSystem, string> = {
  flames_of_war_v4: 'Flames of War V4',
  team_yankee_v2: 'Team Yankee V2',
};

export const gameSystemOptions = gameSystemSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: gameSystemLabels[value] }),
);
