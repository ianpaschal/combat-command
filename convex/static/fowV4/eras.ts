import { Infer, v } from 'convex/values';

export type FowV4Era = {
  id: string;
  displayName: string;
  shortName: string;
};

export const fowV4Eras: FowV4Era[] = [
  // {
  //   id: 'f2687103-654b-41e5-9fe1-7c14eabdf2a4',
  //   displayName: 'Early War',
  //   shortName: 'EW',
  // },
  {
    id: 'flames_of_war_4th_edition::era::mw',
    displayName: 'Mid-War',
    shortName: 'MW',
  },
  {
    id: 'flames_of_war_4th_edition::era::lw',
    displayName: 'Late War',
    shortName: 'LW',
  },
  // {
  //   id: '',
  //   displayName: '',
  //   shortName: 'P',
  // },
  {
    id: 'flames_of_war_4th_edition::era::lwl',
    displayName: 'Late War: Leviathans',
    shortName: 'LWL',
  },
] as const;

export const fowV4EraOptions = fowV4Eras.map((era) => ({
  value: era.id,
  label: era.displayName,
}));

export const fowV4EraId = v.union(...fowV4Eras.map(({ id }) => v.literal(id)));

export type FowV4EraId = Infer<typeof fowV4EraId>;
