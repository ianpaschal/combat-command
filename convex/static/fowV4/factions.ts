import { Infer, v } from 'convex/values';

export type FowV4Faction = {
  id: string;
  displayName: string;
};

export const fowV4Factions: FowV4Faction[] = [
  {
    id: 'flames_of_war_v4::faction::germany',
    displayName: 'Germany',
  },
  {
    id: 'flames_of_war_v4::faction::soviet_union',
    displayName: 'Soviet Union',
  },
  {
    id: 'flames_of_war_v4::faction::united_states',
    displayName: 'United States',
  },
  {
    id: 'flames_of_war_v4::faction::great_britain',
    displayName: 'Great Britain & Commonwealth',
  },
  {
    id: 'flames_of_war_v4::faction::italy',
    displayName: 'Italy',
  },
  {
    id: 'flames_of_war_v4::faction::finland',
    displayName: 'Finland',
  },
  {
    id: 'flames_of_war_v4::faction::hungary',
    displayName: 'Hungary',
  },
  {
    id: 'flames_of_war_v4::faction::romania',
    displayName: 'Romania',
  },
  {
    id: 'flames_of_war_v4::faction::japan',
    displayName: 'Japan',
  },
  {
    id: 'flames_of_war_v4::faction::france',
    displayName: 'France',
  },
] as const;

export const fowV4FactionOptions = fowV4Factions.map((faction) => ({
  value: faction.id,
  label: faction.displayName,
}));

export const fowV4FactionId = v.union(...fowV4Factions.map(({ id }) => v.literal(id)));

export type FowV4FactionId = Infer<typeof fowV4FactionId>;
