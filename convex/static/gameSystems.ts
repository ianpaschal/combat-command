import { Infer, v } from 'convex/values';

export type GameSystem = {
  id: string;
  displayName: string;
};

export const gameSystems = [
  {
    id: 'flames_of_war_v4',
    displayName: 'Flames of War (4th Edition)',
  },
  // {
  //   id: 'team_yankee',
  //   displayName: 'Team Yankee',
  // },
  // {
  //   id: 'great_war',
  //   displayName: 'Great War',
  // },
  // {
  //   id: 'clash_of_steel_1st_edition',
  //   displayName: 'Clash of Steel',
  // },
];

export const gameSystemOptions = gameSystems.map((gameSystem) => ({
  value: gameSystem.id,
  label: gameSystem.displayName,
}));

export const gameSystemId = v.union(...gameSystems.map(({ id }) => v.literal(id)));

export type GameSystemId = Infer<typeof gameSystemId>;
